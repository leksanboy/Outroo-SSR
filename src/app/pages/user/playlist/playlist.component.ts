import { DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Location, DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

import { ShowPlaylistComponent } from '../../../../app/pages/common/showPlaylist/showPlaylist.component';
import { ActiveSessionComponent } from '../../../../app/pages/common/activeSession/activeSession.component';
import { NewPlaylistComponent } from '../../../../app/pages/common/newPlaylist/newPlaylist.component';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var global: any;

@Component({
	selector: 'app-playlist',
	templateUrl: './playlist.component.html',
	providers: [SafeHtmlPipe]
})
export class PlaylistComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public userData: any = [];
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
	public recommendedPlaylists = {
		loading: false,
		noData: true,
		show: false,
		list: []
	};
	public activeSessionComponent: ActiveSessionComponent;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		public dialog: MatDialog,
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
		private metaService: MetaService,
		private routingStateService: RoutingStateService,
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;
		this.userData = this.sessionData ? this.sessionData.current : [];

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
				this.getTranslations(data);
			});

		// Get recommended playlists
		this.getRecommendedPlaylists();

		// Get cover data
		this.playerService.getCoverTrack()
			.subscribe(data => {
				if (data.type === 'playlist') {
					this.dataDefault.info.shadow = data.color ? ('0 20px 50px rgba(' + data.color + ', 0.42)') : null;
				}
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
		this.routingStateService.getPreviousUrl();
	}

	// Push Google Ad
	pushAd() {
		const ad = {
			contentTypeAd: true,
			content: this.env.ad
		};

		setTimeout(() => {
			const g = (this.window['adsbygoogle'] = this.window['adsbygoogle'] || []).push({});
			if (g === 1) {
				this.hideAd = true;
			}
		}, 100);

		return ad;
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
		const data = {
			name: name
		};

		this.audioDataService.getPlaylist(data)
			.subscribe((res: any) => {
				this.dataDefault.loadingData = false;

				if (!res || res.length === 0) {
					this.dataDefault.noData = true;
				} else {
					this.dataDefault.info = res.info;
					(res.info.image ? this.audioDataService.getCoverColor('playlist', this.env.pathAudios + 'covers/' + res.info.image) : null);

					this.dataDefault.list = [];

					if (res.list.length === 0) {
						this.dataDefault.noData = true;
					}

					for (const i in res.list) {
						if (i) {
							this.dataDefault.list.push(res.list[i]);

							// Push ad
							if (res.list.lenght < 15) {
								if (Math.round(res.list.lenght / 2)) {
									this.dataDefault.list.push(this.pushAd());
								}
							} else {
								if (i == '10' || i == '20' || i == '30') {
									this.dataDefault.list.push(this.pushAd());
								}
							}
						}
					}

					// Meta
					const t = res.info.title;
					const metaData = {
						page: t,
						title: t,
						description: t,
						keywords: t,
						url: this.env.url + 'pl/' + name,
						image: res.info.image ? (this.env.urlCdn + 'audios/covers/' + res.info.image) : this.env.defaultPlaylistCover
					};
					this.metaService.setData(metaData);

					// Set Google analytics
					const url = 'pl/' + name;
					const title = t;
					const userId = this.sessionData ? (this.sessionData.current ? this.sessionData.current.id : null) : null;
					this.userDataService.analytics(url, title, userId);
				}
			}, error => {
				this.dataDefault.loadingData = false;
				this.dataDefault.noData = true;
				this.alertService.error(this.translations.common.anErrorHasOcurred);
			});
	}

	// Play item song
	playSong(data, item, key, type) {
		if (this.audioPlayerData.key === key &&
			this.audioPlayerData.type === type &&
			this.audioPlayerData.item.song === item.song
		) { // Play/Pause current
			item.playing = !item.playing;
			this.dataDefault.playing = !this.dataDefault.playing;
			this.playerService.setPlayTrack(this.audioPlayerData);
		} else { // Play new one
			this.audioPlayerData.list = data;
			this.audioPlayerData.item = item;
			this.audioPlayerData.key = key;
			/* this.audioPlayerData.user = this.userData.id;
			this.audioPlayerData.username = this.userData.username; */
			this.audioPlayerData.location = 'playlist';
			this.audioPlayerData.type = type;
			this.audioPlayerData.selectedIndex = this.dataDefault.selectedIndex;
			this.audioPlayerData.postId = this.dataDefault.info.id;

			item.playing = true;
			this.dataDefault.playing = true;
			this.playerService.setData(this.audioPlayerData);
		}
	}

	// Play/Pause
	playTrack(type) {
		if (this.dataDefault.list.length > 0) {
			if (type === 'play') {
				this.playSong(this.dataDefault.list,
					(this.audioPlayerData.item ? this.audioPlayerData.item : this.dataDefault.list[0]),
					(this.audioPlayerData.key ? this.audioPlayerData.key : 0),
					'default');
			} else if (type === 'prev') {
				const prevKey = (this.audioPlayerData.key === 0) ? (this.dataDefault.list.length - 1) : (this.audioPlayerData.key - 1);
				this.audioPlayerData.key = prevKey;
				this.playerService.setData(this.audioPlayerData);
			} else if (type === 'next') {
				const nextKey = (this.audioPlayerData.key === this.dataDefault.list.length - 1) ? 0 : (this.audioPlayerData.key + 1);
				this.audioPlayerData.key = nextKey;
				this.playerService.setData(this.audioPlayerData);
			}
		} else {
			this.alertService.warning(this.translations.common.addSomeSongsToPlaylist);
		}
	}

	// Item options
	itemSongOptions(type, item, playlist) {
		switch (type) {
			case ('addRemoveUser'):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				const dataU = {
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.song
				};

				this.audioDataService.addRemove(dataU)
					.subscribe(res => {
						item.insertedId = res;

						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
						text = item.addRemoveUser ? (' ' + this.translations.common.hasBeenAdded) : (' ' + this.translations.common.hasBeenRemoved);
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case ('playlist'):
				item.removeType = !item.addRemoveUser ? 'add' : 'remove';

				const dataP = {
					type: item.removeType,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				};

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						const song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = ' ' + this.translations.hasBeenAddedTo + playlist.title;

						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case ('createPlaylist'):
				const dataCP = {
					type: 'create',
					item: item
				};

				this.sessionService.setDataCreatePlaylist(dataCP);
				break;
			case ('report'):
				item.type = 'playlist';
				this.sessionService.setDataReport(item);
				break;
			case 'message':
				item.comeFrom = 'shareSong';
				this.sessionService.setDataNewShare(item);
				break;
			case 'newTab':
				const url = this.env.url + 's/' + item.name.slice(0, -4);
				this.window.open(url, '_blank');
				break;
			case 'copyLink':
				const urlExtension = this.env.url + 's/' + item.name.slice(0, -4);
				this.sessionService.setDataCopy(urlExtension);
				break;
			case 'whatsapp':
				const urlWhatsapp = 'https://api.whatsapp.com/send?text=' + this.env.url + 'p/' + item.name;
				this.window.open(urlWhatsapp, '_blank');
				break;
			case 'twitter':
				const urlTwitter = 'https://twitter.com/intent/tweet?text=' + this.env.url + 's/' + item.name;
				this.window.open(urlTwitter, '_blank');
				break;
			case 'facebook':
				const urlFacebook = 'https://www.facebook.com/sharer/sharer.php?u=' + this.env.url + this.sessionData.current.usurname + '&title=' + this.env.url + 's/' + item.name;
				this.window.open(urlFacebook, '_blank');
				break;
			case 'messenger':
				const urlMessenger = 'https://www.facebook.com/dialog/send?link=' + this.env.url + 's/' + item.name + '&app_id=844385062569000&redirect_uri=' + this.env.url + 's/' + item.name;
				this.window.open(urlMessenger, '_blank');
				break;
			case 'telegram':
				const urlTelegram = 'https://t.me/share/url?url=' + this.env.url + 's/' + item.name;
				this.window.open(urlTelegram, '_blank');
				break;
			case 'reddit':
				const urlReddit = 'https://www.reddit.com/submit?title=Share%20this%20post&url=' + this.env.url + 's/' + item.name;
				this.window.open(urlReddit, '_blank');
				break;
		}
	}

	// Playlist options
	itemPlaylistOptions(type, item, index) {
		switch (type) {
			case 'show':
				this.location.go('/pl/' + item.name);

				const configShow = {
					disableClose: false,
					data: {
						sessionData: this.sessionData,
						userData: this.sessionData.current,
						translations: this.translations,
						item: item,
						audioPlayerData: this.audioPlayerData
					}
				};

				const dialogRefShow = this.dialog.open(ShowPlaylistComponent, configShow);
				dialogRefShow.beforeClosed().subscribe((res: string) => {
					// Set url
					this.location.go(this.router.url);
				});
				break;
			case 'edit':
				this.location.go('/' + this.sessionData.current.username + '/songs#editPlaylist');
				item.path = this.env.pathAudios;
				item.index = index;

				const configEdit = {
					disableClose: false,
					data: {
						type: 'edit',
						sessionData: this.sessionData,
						translations: this.translations,
						item: item
					}
				};

				const dialogRefEdit = this.dialog.open(NewPlaylistComponent, configEdit);
				dialogRefEdit.afterClosed().subscribe((res: any) => {
					this.location.go(this.router.url);

					if (res) {
						const data = {
							index: res.index,
							item: res
						};

						this.updatePlaylist('edit', data);
					}
				});
				break;
			case 'publicPrivate':
				item.private = !item.private;
				item.privateType = item.private ? 'private' : 'public';

				const dataPPS = {
					type: item.privateType,
					id: item.id
				};

				this.audioDataService.publicPrivate(dataPPS).subscribe();
				break;
			case 'addRemoveSession':
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = !item.addRemoveSession ? 'add' : 'remove';
				item.removed = item.addRemoveSession ? true : false;

				const dataARS = {
					type: item.removeType,
					location: 'session',
					id: item.idPlaylist
				};

				this.audioDataService.addRemovePlaylist(dataARS)
					.subscribe((res: any) => {
						this.updatePlaylist('addRemoveSession', null);
					});
				break;
			case 'addRemoveUser':
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				const dataARO = {
					type: item.removeType,
					location: 'user',
					id: item.id,
					title: item.title,
					image: item.image,
					playlist: item.idPlaylist,
					insertedPlaylist: item.insertedPlaylist
				};

				this.audioDataService.addRemovePlaylist(dataARO)
					.subscribe((res: any) => {
						item.idPlaylist = res;
						item.insertedPlaylist = item.insertedPlaylist ? item.insertedPlaylist : res;
						this.updatePlaylist('addRemoveUser', item);

						this.alertService.success(this.translations.common.clonedPlaylistSuccessfully);
					});
				break;
			case 'follow':
				item.followUnfollow = !item.followUnfollow;
				item.removeType = item.followUnfollow ? 'add' : 'remove';

				const dataF = {
					type: item.removeType,
					location: 'user',
					id: item.id,
					title: item.title,
					image: item.image,
					playlist: item.idPlaylist,
					insertedPlaylist: item.insertedPlaylist
				};

				this.audioDataService.followPlaylist(dataF)
					.subscribe((res: any) => {
						this.alertService.success(this.translations.common.followingPlaylistSuccessfully);
					});

				break;
			case 'report':
				item.type = 'audioPlaylist';
				this.sessionService.setDataReport(item);
				break;
			case 'message':
				item.comeFrom = 'sharePlaylist';
				this.sessionService.setDataNewShare(item);
				break;
			case 'newTab':
				const url = this.env.url + 'pl/' + item.name;
				this.window.open(url, '_blank');
				break;
			case 'copyLink':
				const urlExtension = this.env.url + 'pl/' + item.name;
				this.sessionService.setDataCopy(urlExtension);
				break;
			case 'whatsapp':
				const urlWhatsapp = 'https://api.whatsapp.com/send?text=' + this.env.url + 'pl/' + item.name;
				this.window.open(urlWhatsapp, '_blank');
				break;
			case 'twitter':
				const urlTwitter = 'https://twitter.com/intent/tweet?text=' + this.env.url + 'pl/' + item.name;
				this.window.open(urlTwitter, '_blank');
				break;
			case 'facebook':
				const urlFacebook = 'https://www.facebook.com/sharer/sharer.php?u=' + this.env.url + this.sessionData.current.usurname + '&title=' + this.env.url + 'pl/' + item.name;
				this.window.open(urlFacebook, '_blank');
				break;
			case 'messenger':
				const urlMessenger = 'https://www.facebook.com/dialog/send?link=' + this.env.url + 'pl/' + item.name + '&app_id=844385062569000&redirect_uri=' + this.env.url + 'pl/' + item.name;
				this.window.open(urlMessenger, '_blank');
				break;
			case 'telegram':
				const urlTelegram = 'https://t.me/share/url?url=' + this.env.url + 'pl/' + item.name;
				this.window.open(urlTelegram, '_blank');
				break;
			case 'reddit':
				const urlReddit = 'https://www.reddit.com/submit?title=Share%20this%20post&url=' + this.env.url + 'pl/' + item.name;
				this.window.open(urlReddit, '_blank');
				break;
		}
	}

	// Update playlist
	updatePlaylist(type, data) {
		if (type === 'create') {
			const d = {
				type: 'create',
				item: null
			};
			this.sessionService.setDataCreatePlaylist(d);
		} else if (type === 'edit') {
			let newPl = [];

			for (let p of this.sessionData.current.playlists) {
				if (p.id == data.item.id) {
					newPl.push(data.item);
				} else {
					newPl.push(p);
				}
			}

			this.sessionData.current.playlists = newPl;
			this.sessionData.current.playlists = this.sessionData.current.playlists;
		} else if (type === 'addRemoveSession') {
			this.sessionData.current.playlists = this.sessionData.current.playlists;
		} else if (type === 'addRemoveUser') {
			if (data.type === 'add') {
				this.sessionData.current.playlists.unshift(data);
			} else {
				for (const i in this.sessionData.current.playlists) {
					if (i) {
						if (this.sessionData.current.playlists[i].id = data.id) {
							this.sessionData.current.playlists[i] = data;
						}
					}
				}
			}
		}

		// Update playslists on selects
		this.sessionData = this.userDataService.setSessionData('update', this.sessionData.current);
		this.sessionService.setDataPlaylists(this.sessionData);
	}

	// Recommended playlists
	getRecommendedPlaylists() {
		this.recommendedPlaylists.show = !this.recommendedPlaylists.show;
		this.recommendedPlaylists.loading = true;

		if (this.recommendedPlaylists.show && this.recommendedPlaylists.list.length === 0) {
			const data = {
				user: this.userData.id
			};

			this.audioDataService.getRecommendedPlaylists(data)
				.subscribe((res: any) => {
					this.recommendedPlaylists.loading = false;

					if (!res || res.length === 0) {
						this.recommendedPlaylists.noData = true;
					} else {
						this.recommendedPlaylists.noData = false;
						this.recommendedPlaylists.list = res;
					}
				}, error => {
					this.recommendedPlaylists.loading = false;
				});
		} else {
			this.recommendedPlaylists.loading = false;
		}
	}
}
