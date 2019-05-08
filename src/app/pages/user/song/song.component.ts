import { DOCUMENT, DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var global: any;

@Component({
	selector: 'app-song',
	templateUrl: './song.component.html',
	providers: [ SafeHtmlPipe ]
})
export class SongComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public dataDefault: any = {
		data: []
	};
	public data: any = [];
	public activePlayerInformation: any;
	public activeLanguage: any;
	public hideAd: boolean;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private location: Location,
		private titleService: Title,
		private sanitizer: DomSanitizer,
		private alertService: AlertService,
		private playerService: PlayerService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private metaService: MetaService
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Load default
		const n: any = this.activatedRoute.snapshot.params.name;
		this.default(n);

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
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activePlayerInformation.unsubscribe();
		this.activeLanguage.unsubscribe();
	}

	// Go back
	goBack() {
		this.router.navigate(['/' + this.sessionData.current.username + '/songs']);
	}

	// Push Google Ad
	pushAd() {
		let ad = this.env.ad;

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
				this.dataDefault.loadingData = false;

				if (!res || res.length == 0) {
					this.dataDefault.noData = true;
				} else {
					this.dataDefault.data = res;
					let t = (res.original_artist && res.original_title) ? (res.original_artist + ' - ' + res.original_title) : res.title;

					// Meta
					let metaData = {
						page: t,
						title: t,
						description: t,
						keywords: t,
						url: this.env.url + 's/' + name,
						image: res.image ? (this.env.url + 'assets/media/audios/thumbnails/' + res.image) : this.env.image
					};
					this.metaService.setData(metaData);

					// Set Google analytics
					let url = '[' + res.id + ']/[' + name + ']/s/' + t;
					this.userDataService.analytics(url);
				}
			}, error => {
				this.dataDefault.loadingData = false;
				this.dataDefault.noData = true;
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
				this.sessionService.setDataShowShare(item);
				break;
			case "copyLink":
				let urlExtension = this.env.url + 's/' + item.name.slice(0, -4);
				urlExtension.toString();
				this.sessionService.setDataCopy(urlExtension);
				break;
		}
	}
}
