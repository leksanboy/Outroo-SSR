import { DOCUMENT, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { ChatDataService } from '../../../../app/core/services/user/chatData.service';
import { PhotoDataService } from '../../../../app/core/services/user/photoData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';
import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';

declare var ga: Function;
declare var global: any;

// √ Ha comenzado a seguirte
// √ Solicitud de amistad
// √ Ha aceptado la solicitud de amistad (cuenta privada)

// √ Like en la foto
// √ Comentario en la foto
// x Mencion en la foto
// √ Mencion en el comentario en la foto
// √ Ha compartido una foto
// √ Eliminar comentarios dentro de mi foto (creader de la foto y creador del comentario)

// √ Like en la publicacion
// √ Comentario en la publicacion
// √ Mencion en la publicacion
// √ Mencion en el comentario en la publicacion 
// √ Ha compartido una publicacion
// √ Eliminar comentarios dentro de mi publicacion (creader de la publicacion y creador del comentario)

// √ Ha compartido una cancion
// √ Ha compartido una cancion desde una publicacion (show, main & home)
// - Ha compartido una playlist desde canciones
// - Te ha enviado un mensaje (msg corto)

// √ Cambiar el usted/su por tu (es_ES)
// - Cambiar el usted/su por tu (ru_RU)
// ? Comentarios con counter a la derecha

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public dataNotifications: any = [];
	public dataChats: any = [];
	public data: any = {
		selectedIndex: 0
	};
	public activeRouter: any;
	public activeConversation: any;
	public activeLanguage: any;
	public audioPlayerData: any = [];

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		public dialog: MatDialog,
		private location: Location,
		private titleService: Title,
		private alertService: AlertService,
		private playerService: PlayerService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private chatDataService: ChatDataService,
		private photoDataService: PhotoDataService,
		private audioDataService: AudioDataService,
		private followsDataService: FollowsDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService,
		private ssrService: SsrService
	) {
		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

		// Exit if no session
		if (!this.sessionData)
			this.userDataService.noSessionData();

		// Set component data
		this.activeRouter = this.router.events
			.subscribe(event => {
				if(event instanceof NavigationEnd) {
					// Go top of page on change user
					if (this.ssrService.isBrowser) {
						this.window.scrollTo(0, 0);
					}

					// Set Google analytics
					let urlGa =  '[' + this.sessionData.current.id + ']/notifications';
					ga('set', 'page', urlGa);
					ga('send', 'pageview');

					// Load default
					this.default('default', this.sessionData.current.id);
				}
			});

		// Get conversation
		this.activeConversation = this.sessionService.getDataShowConversation()
			.subscribe(data => {
				// Check if is new chat with content
				if (data.close)
					if (data.new && data.list.length > 0)
						this.dataChats.list.unshift(data);
					else if (data.list.length > 0)
						for (let i in this.dataChats.list)
							if(this.dataChats.list[i].id == data.item.id)
								this.dataChats.list[i].last = data.last;
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

			if (windowBottom >= docHeight) {
				if (this.dataNotifications.list.length > 0)
					this.default('more', null);
			}
		}
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeConversation.unsubscribe();
		this.activeLanguage.unsubscribe();
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
				this.titleService.setTitle(this.translations.notifications.title);
			});
	}

	// Default
	default(type, user) {
		if (type == 'default') {
			this.dataNotifications = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noData: false,
				noMore: false
			}

			let data = {
				user: user,
				type: 'default',
				rows: this.dataNotifications.rows,
				cuantity: environment.cuantity
			}

			this.notificationsDataService.default(data)
				.subscribe(res => {
					this.dataNotifications.loadingData = false;

					if (!res || res.length == 0) {
						this.dataNotifications.noData = true;
					} else {
						this.dataNotifications.loadMoreData = (!res || res.length < environment.cuantity) ? false : true;

						for (let i in res)
							setTimeout(() => {
								res[i].status = 1;
							}, 1800);

						this.dataNotifications.list = res;
						this.sessionService.setPendingNotifications('refresh');
					}

					if (!res || res.length < environment.cuantity)
						this.dataNotifications.noMore = true;
				}, error => {
					this.dataNotifications.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataNotifications.noMore && !this.dataNotifications.loadingMoreData) {
			this.dataNotifications.loadingMoreData = true;
			this.dataNotifications.rows++;

			let data = {
				user: this.sessionData.current.id,
				rows: this.dataNotifications.rows,
				cuantity: environment.cuantity
			}

			this.notificationsDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataNotifications.loadMoreData = (!res || res.length < environment.cuantity) ? false : true;
						this.dataNotifications.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0)
							for (let i in res) {
								setTimeout(() => {
									res[i].status = 1;
								}, 1800);

								this.dataNotifications.list.push(res[i]);
							}

						this.sessionService.setPendingNotifications('refresh');

						if (!res || res.length < environment.cuantity)
							this.dataNotifications.noMore = true;
					}, 600);
				}, error => {
					this.dataNotifications.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Follow / Unfollow
	followUnfollow(type, item){
		if (type == 'accept') {
			// When other send you a request
			item.type = 'startFollowing';
			item.statusF = 'accept';

			let data = {
				type: item.statusF,
				private: item.private,
				receiver: this.sessionData.current.id,
				sender: item.user.id
			}

			// Check following status
			this.followsDataService.followUnfollow(data)
				.subscribe((res: any) => {
					item.statusFollowing = res;
				});
		} else if (type == 'decline') {
			// When other send you a request
			item.type = 'startFollowing';
			item.statusFollowing = 'declined';
			item.statusF = 'decline';

			let data = {
				type: item.statusF,
				private: item.private,
				receiver: this.sessionData.current.id,
				sender: item.user.id
			}

			this.followsDataService.followUnfollow(data).subscribe();
		} else if (type == 'follow') { 
			// When you start following someone who follow you
			item.statusFollowing = item.private ? 'pending' : 'following';

			let data = {
				type: item.statusFollowing,
				private: item.private,
				receiver: item.user.id,
				sender: this.sessionData.current.id
			}

			this.followsDataService.followUnfollow(data).subscribe();
		} else if (type == 'unfollow') { 
			// Stop following
			item.statusFollowing = 'unfollow';

			let data = {
				type: item.statusFollowing,
				private: item.private,
				receiver: item.user.id,
				sender: this.sessionData.current.id
			}

			this.followsDataService.followUnfollow(data).subscribe();
		}
	}

	// Show photo from url if is one
	show(item) {
		if (item.url == 'photos') {
			this.sessionService.setDataShowPhoto(item);
		} else if (item.url == 'publications') {
			this.sessionService.setDataShowPublication(item);
		}
	}

	// Item options
	itemOptions(type, item){
		switch (type) {
			case "remove":
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				let dataAddRemove = {
					id: item.id,
					type: item.removeType,
					user: this.sessionData.current.id
				}

				this.notificationsDataService.addRemove(dataAddRemove).subscribe();
				break;
			case "report":
				item.type = 'notification';
				this.sessionService.setDataReport(item);
				break;
		}
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
				this.audioPlayerData.location = 'notifications';
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
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				let dataARO = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.id
				}

				this.audioDataService.addRemove(dataARO)
					.subscribe(res => {
						item.insertedId = res;
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
			case "newTab":
				let url = this.environment.url + 's/' + item.name.slice(0, -4);
				this.window.open(url, '_blank');
				break;
			case "copyLink":
				let urlExtension = this.environment.url + 's/' + item.name.slice(0, -4);
				urlExtension.toString();
				this.sessionService.setDataCopy(urlExtension);
				break;
		}
	}

	// // Default
	// defaultChats(type, user) {
	// 	if (type == 'default') {
	// 		this.dataChats = {
	// 			list: [],
	// 			rows: 0,
	// 			loadingData: true,
	// 			loadMoreData: false,
	// 			loadingMoreData: false,
	// 			noData: false,
	// 			noMore: false
	// 		}

	// 		let data = {
	// 			user: user,
	// 			rows: this.dataChats.rows,
	// 			cuantity: environment.cuantity
	// 		}

	// 		this.chatDataService.default(data)
	// 			.subscribe(res => {
	// 				this.dataChats.loadingData = false;

	// 				if (!res || res.length == 0) {
	// 					this.dataChats.noData = true;
	// 				} else {
	// 					this.dataChats.loadMoreData = (!res || res.length < environment.cuantity) ? false : true;
	// 					this.dataChats.list = res;
	// 				}

	// 				if (!res || res.length < environment.cuantity)
	// 					this.dataChats.noMore = true;
	// 			}, error => {
	// 				this.dataChats.loadingData = false;
	// 				this.alertService.error(this.translations.common.anErrorHasOcurred);
	// 			});
	// 	} else if (type == 'more' && !this.dataChats.noMore && !this.dataChats.loadingMoreData) {
	// 		this.dataChats.loadingMoreData = true;
	// 		this.dataChats.rows++;

	// 		let data = {
	// 			user: this.sessionData.current.id,
	// 			rows: this.dataChats.rows,
	// 			cuantity: environment.cuantity
	// 		}

	// 		this.chatDataService.default(data)
	// 			.subscribe(res => {
	// 				setTimeout(() => {
	// 					this.dataChats.loadMoreData = (!res || res.length < environment.cuantity) ? false : true;
	// 					this.dataChats.loadingMoreData = false;

	// 					// Push items
	// 					if (!res || res.length > 0)
	// 						for (let i in res)
	// 							this.dataChats.list.push(res[i]);

	// 					if (!res || res.length < environment.cuantity)
	// 						this.dataChats.noMore = true;
	// 				}, 600);
	// 			}, error => {
	// 				this.dataChats.loadingData = false;
	// 				this.alertService.error(this.translations.common.anErrorHasOcurred);
	// 			});
	// 	}
	// }

	// // Item options
	// itemOptionsChat(type, item){
	// 	switch(type){
	// 		case("remove"):
	// 			item.addRemoveSession = !item.addRemoveSession;
	// 			item.removeType = item.addRemoveSession ? 'remove' : 'add';

	// 			let dataSession = {
	// 				id: item.id,
	// 				type: item.removeType,
	// 				user: this.sessionData.current.id
	// 			}

	// 			this.chatDataService.addRemove(dataSession).subscribe();
	// 		break;
	// 		case("report"):
	// 			item.type = 'chat';
	// 			this.sessionService.setDataReport(item);
	// 		break;
	// 	}
	// }

	// // Open conversation
	// showConversation(type, data) {
	// 	data = (type == 'new') ? [] : data;
	// 	data.comeFrom = type;
	// 	data.close = false;

	// 	this.sessionService.setDataShowConversation(data);
	// }
}
