import { DOCUMENT, DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

import { NewPlaylistComponent } from '../../../../app/pages/common/newPlaylist/newPlaylist.component';
import { ShowPlaylistComponent } from '../../../../app/pages/common/showPlaylist/showPlaylist.component';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var ga: Function;
declare var global: any;

@Component({
	selector: 'app-song',
	templateUrl: './song.component.html',
	providers: [ SafeHtmlPipe ]
})
export class SongComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public dataSong: any = {
		data: []
	};
	public data: any = {
		selectedIndex: 0,
		active: 'default',
		path: 'assets/media/audios/'
	};
	public dataFiles: any = {
		list: [],
		reload: false,
		actions: true,
		saveDisabled: false,
		counter: 0
	};
	public activeRouter: any;
	public activePlayerInformation: any;
	public activeLanguage: any;
	public actionFormSearch: FormGroup;
	public hideAd: boolean;
	public audio = new Audio();

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private _fb: FormBuilder,
		public dialog: MatDialog,
		private location: Location,
		private titleService: Title,
		private sanitizer: DomSanitizer,
		private alertService: AlertService,
		private playerService: PlayerService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private metaService: MetaService,
		private ssrService: SsrService
	) {
		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

		// Check if session exists
		if (!this.sessionData) {
			this.sessionData = [];
			this.sessionData.current = {
				id: null
			};
		}

		// Set component data
		this.activeRouter = this.router.events
			.subscribe(event => {
				if(event instanceof NavigationEnd) {
					// Go top of page on change user
					if (this.ssrService.isBrowser) {
						this.window.scrollTo(0, 0);
					}

					// Get url data
					let urlData: any = this.activatedRoute.snapshot.params.name;

					// Load default
					this.data.selectedIndex = 0;
					this.default(urlData);
				}
			});

		// Get player data
		this.activePlayerInformation = this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				let lang = data.current.language;
				this.getTranslations(lang);
			});

		// Load more on scroll on bottom
		this.window.onscroll = (event) => {
			let windowHeight = "innerHeight" in this.window ? this.window.innerHeight : document.documentElement.offsetHeight;
			let body = document.body, html = document.documentElement;
			let docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			let windowBottom = windowHeight + this.window.pageYOffset;
		}
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activePlayerInformation.unsubscribe();
		this.activeLanguage.unsubscribe();
	}

	// Go back
	goBack() {
		this.router.navigate(['/' + this.sessionData.current.username + '/songs']);
	}

	// Push Google Ad
	pushAd() {
		let ad = this.environment.ad;

		let a = {
			contentTypeAd: true,
			content: ad
		}

		setTimeout(() => {
			let g = (this.window['adsbygoogle'] = this.window['adsbygoogle'] || []).push({});
			if (g == 1) this.hideAd = true;
		}, 100);

		return a;
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Default
	default(name) {
		let data = {
			name: name
		}

		this.audioDataService.getSong(data)
			.subscribe(res => {
				this.dataSong.loadingData = false;

				if (!res || res.length == 0) {
					this.dataSong.noData = true;
				} else {
					this.dataSong.data = res;
					let t = (res.original_artist && res.original_title) ? (res.original_artist + ' - ' + res.original_title) : res.title;

					let metaData = {
						page: t,
						title: t,
						description: t,
						keywords: t,
						url: this.environment.url + 's/' + name,
						image: this.environment.url + 'assets/media/audios/thumbnails/' + res.image
					};
					this.metaService.setData(metaData);
				}
			}, error => {
				this.dataSong.loadingData = false;
				this.dataSong.noData = true;
				this.alertService.error(this.translations.common.anErrorHasOcurred);
			});
	}

	// Play song
	playSong(data, item, key, type) {
		if (!this.sessionData.current.id) {
			this.alertService.success(this.translations.common.createAnAccountToListenSong);
		} else {
			if (this.audioPlayerData.key == key && this.audioPlayerData.type == type && this.audioPlayerData.item.song == item.song) { // Play/Pause current
				item.playing = !item.playing;
				this.playerService.setPlayTrack(this.audioPlayerData);
			} else { // Play new one
				this.audioPlayerData.list = [data];
				this.audioPlayerData.item = item;
				this.audioPlayerData.key = key;
				this.audioPlayerData.user = this.sessionData.current.id;
				this.audioPlayerData.username = this.sessionData.current.username;
				this.audioPlayerData.location = 'song';
				this.audioPlayerData.type = type;
				this.audioPlayerData.selectedIndex = this.data.selectedIndex;

				this.playerService.setData(this.audioPlayerData);
				item.playing = true;
			}
		}
	}

	// Item options
	itemSongOptions(type, item, playlist) {
		switch(type){
			case("addRemoveUser"):
				item.removeType = !item.addRemoveUser ? "add" : "remove";

				let dataARO = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.id
				}

				this.audioDataService.addRemove(dataARO)
					.subscribe(res => {
						item.insertedId = res.json();
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case("playlist"):
				item.removeType = !item.addRemoveUser ? "add" : "remove";

				let dataP = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				}

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = ' ' + this.translations.common.hasBeenAddedTo + ' ' + playlist.title;
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case("report"):
				item.type = 'audio';
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Share on social media
	shareOn(type, item) {
		switch (type) {
			case "message":
				item.comeFrom = 'shareSong';
				this.sessionService.setDataShowConversation(item);
				break;
			case "copyLink":
				let urlExtension = this.environment.url + 's/' + item.name.slice(0, -4);
				urlExtension.toString();
				this.sessionService.setDataCopy(urlExtension);
				break;
		}
	}
}
