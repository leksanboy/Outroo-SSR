import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
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
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

import { NewPlaylistComponent } from '../../../../app/pages/common/newPlaylist/newPlaylist.component';
import { ShowPlaylistComponent } from '../../../../app/pages/common/showPlaylist/showPlaylist.component';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';
import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { ChatDataService } from '../../../../app/core/services/user/chatData.service';

declare var global: any;

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	providers: [TimeagoPipe, SafeHtmlPipe]
})
export class NotificationsComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public dataDefault: any = [];
	public dataChats: any = [];
	public dataConversation: any = [];
	public data: any = {
		selectedIndex: 0
	};
	public activeLanguage: any;
	public audioPlayerData: any = [];
	public searchBoxMentions: boolean;

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
		private chatDataService: ChatDataService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private followsDataService: FollowsDataService,
		private routingStateService: RoutingStateService,
		private notificationsDataService: NotificationsDataService,
		private ssrService: SsrService,
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Data
		if (this.sessionData) {
			// Set Google analytics
			const url = 'notifications';
			const title = this.translations.notifications.title;
			const userId = this.sessionData.current.id;
			this.userDataService.analytics(url, title, userId);

			// Set title
			this.titleService.setTitle(title);

			// Load default
			this.default('default');

			/* const localStotageData = this.userDataService.getLocalStotage('notificationsPage');
			if (localStotageData) {
				this.dataDefault = localStotageData;
			} else {
				this.default('default');
			} */
		} else {
			this.userDataService.noSessionData();
		}

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				this.getTranslations(data);
			});

		// Load more on scroll on bottom
		this.window.onscroll = (event) => {
			const windowHeight = 'innerHeight' in this.window ? this.window.innerHeight : document.documentElement.offsetHeight;
			const body = document.body, html = document.documentElement;
			const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			const windowBottom = windowHeight + this.window.pageYOffset;

			if (windowBottom >= docHeight) {
				if (this.dataDefault.list.length > 0) {
					this.default('more');
				}
			}
		};
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeLanguage.unsubscribe();
	}

	// Go back
	goBack() {
		this.routingStateService.getPreviousUrl();
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
				this.titleService.setTitle(this.translations.notifications.title);
			});
	}

	// Default
	default(type) {
		if (type === 'default') {
			this.dataDefault = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noData: false,
				noMore: false
			};

			const data = {
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.notificationsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadingData = false;

					if (!res || res.length === 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataDefault.list = res;

						setTimeout(() => {
							for (const i of this.dataDefault.list) {
								if (i) {
									i.is_seen = 1;
								}
							}

							this.sessionService.setPendingNotifications('clear');
						}, 1800);
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataDefault.noMore = true;
					}

					this.userDataService.setLocalStotage('notificationsPage', this.dataDefault);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			const data = {
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.notificationsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
					this.dataDefault.loadingMoreData = false;

					// Push items
					if (!res || res.length > 0) {
						for (const i in res) {
							if (res[i]) {
								setTimeout(() => {
									res[i].is_seen = 1;
								}, 1800);

								this.dataDefault.list.push(res[i]);
							}
						}
					}

					this.sessionService.setPendingNotifications('refresh');

					if (!res || res.length < this.env.cuantity) {
						this.dataDefault.noMore = true;
					}

					this.userDataService.setLocalStotage('notificationsPage', this.dataDefault);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Set tab on click
	setTab(tab) {
		switch (tab) {
			case 0:
				/* General: always set */
				break;
			case 1:
				if (!this.dataChats.list) {
					this.defaultChats('default');
				}
				break;
		}
	}

	// Default chat
	defaultChats(type) {
		if (type === 'default') {
			this.dataChats = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noData: false,
				noMore: false
			};

			const data = {
				rows: this.dataChats.rows,
				cuantity: this.env.cuantity * 3
			};

			this.chatDataService.default(data)
				.subscribe((res: any) => {
					this.dataChats.loadingData = false;

					if (!res || res.length === 0) {
						this.dataChats.noData = true;
					} else {
						this.dataChats.loadMoreData = (!res || res.length < this.env.cuantity * 3) ? false : true;
						this.dataChats.list = res;
					}

					if (!res || res.length < this.env.cuantity * 3) {
						this.dataChats.noMore = true;
					}
				}, error => {
					this.dataChats.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataChats.noMore && !this.dataChats.loadingMoreData) {
			this.dataChats.loadingMoreData = true;
			this.dataChats.rows++;

			const data = {
				rows: this.dataChats.rows,
				cuantity: this.env.cuantity * 3
			};

			this.chatDataService.default(data)
				.subscribe((res: any) => {
					this.dataChats.loadMoreData = (!res || res.length < this.env.cuantity * 3) ? false : true;
					this.dataChats.loadingMoreData = false;

					if (!res || res.length > 0) {
						for (const i in res) {
							if (i) {
								this.dataChats.list.push(res[i]);
							}
						}
					}

					if (!res || res.length < this.env.cuantity * 3) {
						this.dataChats.noMore = true;
					}
				}, error => {
					this.dataChats.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Open chat conversation
	showChat(item) {
		let view = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

		if (view === 'desktop') {
			this.dataConversation = [];
			this.dataConversation.active = true;
			this.dataConversation.id = item.id;
			this.dataConversation.item = item;
			this.dataConversation.list = [];
			this.dataConversation.loadingData = true;
			this.newComment('clear', null, this.dataConversation);

			const data = {
				id: item.id,
				rows: item.rows ? item.rows = 1 : 0,
				cuantity: this.env.cuantity * 3
			};

			this.chatDataService.conversation(data)
				.subscribe((res: any) => {
					this.dataConversation.loadingData = false;

					if (!res || res.length === 0) {
						this.dataConversation.noData = true;
					} else {
						this.dataConversation.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataConversation.list = res;
					}

					if (!res || res.length < this.env.cuantity) {
						item.noMore = true;
						this.dataConversation.noMore = item.noMore;
					}
				}, error => {
					this.dataConversation.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (view === 'mobile') {
			this.sessionService.setDataShowChat(item);
		}
	}

	// Follow / Unfollow
	followUnfollow(type, item) {
		if (type === 'accept') {
			// When other send you a request
			item.type = 'startFollowing';
			item.statusType = 'accept';

			const data = {
				type: item.statusType,
				private: item.private,
				sender: item.user.id
			};

			// Check following status
			this.followsDataService.followUnfollow(data)
				.subscribe((res: any) => {
					item.status = res;
				});
		} else if (type === 'decline') {
			// When other send you a request
			item.type = 'startFollowing';
			item.status = 'declined';
			item.statusType = 'decline';

			const data = {
				type: item.statusType,
				private: item.private,
				sender: item.user.id
			};

			this.followsDataService.followUnfollow(data).subscribe();
		} else if (type === 'follow') {
			// When you start following someone who follow you
			item.status = item.private ? 'pending' : 'following';

			const data = {
				type: item.status,
				private: item.private,
				receiver: item.user.id
			};

			this.followsDataService.followUnfollow(data).subscribe();
		} else if (type === 'unfollow') {
			// Stop following
			item.status = 'unfollow';

			const data = {
				type: item.status,
				private: item.private,
				receiver: item.user.id
			};

			this.followsDataService.followUnfollow(data).subscribe();
		}

		this.userDataService.setLocalStotage('notificationsPage', this.dataDefault);
	}

	// Show from url if is one
	show(item) {
		if (item.url === 'publication') {
			this.sessionService.setDatashowPost(item);
		} else if (item.url === 'message') {
			this.sessionService.setDataShowChat(item.user);
		}
	}

	// Play song
	playSong(data, item, key, type) {
		if (this.audioPlayerData.key === key &&
			this.audioPlayerData.type === type &&
			this.audioPlayerData.item.song === item.song
		) { // Play/Pause current
			item.playing = !item.playing;
			this.playerService.setPlayTrack(this.audioPlayerData);
		} else { // Play new one
			this.audioPlayerData.list = data;
			this.audioPlayerData.item = item;
			this.audioPlayerData.key = key;
			/* this.audioPlayerData.user = this.sessionData.current.id;
			this.audioPlayerData.username = this.sessionData.current.username; */
			this.audioPlayerData.location = 'notifications';
			this.audioPlayerData.type = type;
			/* this.audioPlayerData.selectedIndex = this.data.selectedIndex; */

			this.playerService.setData(this.audioPlayerData);
			item.playing = true;
		}
	}

	// Item options
	itemNotificationOptions(type, item) {
		switch (type) {
			case 'remove':
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				const dataAddRemove = {
					id: item.id,
					type: item.removeType
				};

				this.notificationsDataService.addRemove(dataAddRemove).subscribe();
				break;
			case 'report':
				item.type = 'notification';
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Item options
	itemChatOptions(type, item){
		switch(type){
			case("remove"):
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				let d = {
					id: item.id,
					type: item.removeType
				}

				this.chatDataService.addRemove(d).subscribe();
			break;
			case("removeComment"):
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				let dc = {
					id: item.id,
					type: item.removeType
				}

				this.chatDataService.addRemoveComment(dc).subscribe();
			break;
			case("report"):
				item.type = 'chat';
				this.sessionService.setDataReport(item);
			case("reply"):
				this.dataConversation.reply = item;
			break;
			case("info"):
				item.info = !item.info;
			break;
		}
	}

	// Item options
	itemSongOptions(type, item, playlist) {
		switch (type) {
			case('addRemoveUser'):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				const dataU = {
					user: this.sessionData.current.id,
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
			case('playlist'):
				item.removeType = !item.addRemoveUser ? 'add' : 'remove';

				const dataP = {
					session: this.sessionData.current.id,
					translations: this.translations,
					type: item.removeType,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				};

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						const song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = ' ' + this.translations.common.hasBeenAddedTo + playlist.title;

						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case ('createPlaylist'):
				this.location.go(this.router.url + '#NewPlaylist');

				const config = {
					disableClose: false,
					data: {
						type: 'create',
						sessionData: this.sessionData,
						translations: this.translations
					}
				};

				const dialogRef = this.dialog.open(NewPlaylistComponent, config);
				dialogRef.afterClosed().subscribe((res: any) => {
					this.location.go(this.router.url);

					if (res) {
						this.alertService.success(this.translations.common.createdSuccessfully);

						// Add song to playlist
						if (item) {
							const dataSong = {
								type: 'add',
								location: 'playlist',
								playlist: res.id,
								item: item.id
							};
							this.audioDataService.addRemove(dataSong).subscribe();
						}

						if (this.sessionData.current.playlists) {
							this.sessionData.current.playlists.unshift(res);
						} else {
							this.sessionData.current.playlists = [];
							this.sessionData.current.playlists.push(res);
						}

						// Set playlist on session data
						this.sessionData = this.userDataService.setSessionData('update', this.sessionData.current);
						this.sessionService.setDataPlaylists(this.sessionData);
					}
				});
				break;
			case('report'):
				item.type = 'audio';
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
				const urlWhatsapp = 'https://api.whatsapp.com/send?text=' + this.env.url + 's/' + item.name;
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
			case ('show'):
				this.location.go('/pl/' + item.name);

				const configShow = {
					disableClose: false,
					data: {
						sessionData: this.sessionData,
						userData: this.sessionData,
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
			case ('addRemoveUser'):
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

						if (dataARO.type === 'add') {
							this.sessionData.current.playlists.unshift(dataARO);
						} else {
							for (const i in this.sessionData.current.playlists) {
								if (i) {
									if (this.sessionData.current.playlists[i].id = dataARO.id) {
										this.sessionData.current.playlists[i] = dataARO;
									}
								}
							}
						}
						// Update playslists on selects
						this.sessionData = this.userDataService.setSessionData('update', this.sessionData.current);
						this.sessionService.setDataPlaylists(this.sessionData);

						this.alertService.success(this.translations.common.clonedPlaylistSuccessfully);
					});
				break;
			case ('follow'):
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
			case ('report'):
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

	// New comment
	newComment(type, event, item) {
		if (type === 'clear') {
			item.newCommentData = [];

			setTimeout(() => {
				item.newCommentData = {
					original: '',
					transformed: '',
					onBackground: '',
					eventTarget: '',
					lastTypedWord: []
				};

				// Put as default
				this.newComment('checkPlaceholder', null, item);
			}, 100);
		} else if (type === 'writingChanges') {
			let str = event;
			item.newCommentData.original = event;

			// new line
			str = str.replace(/\n/g, '<br>');

			// hashtag
			str = str.replace(/(#)\w+/g, function (value) {
				return '<span class="hashtag">' + value + '</span>';
			});

			// mention
			str = str.replace(/(@)\w+/g, function (value) {
				return '<span class="mention">' + value + '</span>';
			});

			// url
			str = str.replace(this.env.urlRegex, function (value) {
				return '<span class="url">' + value + '</span>';
			});

			// writing content
			item.newCommentData.transformed = str;

			// check empty contenteditable
			this.newComment('checkPlaceholder', null, item);
		} else if (type === 'keyCode') {
			if (event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 27) {
				// Space, Enter, Escape
				this.searchBoxMentions = false;
			} else {
				if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
					this.searchBoxMentions = false;
				} else {
					item.newCommentData.eventTarget = event.target;
					const position = this.getCaretPosition(event.target);
					const word = this.getCurrentWord(event.target, position);

					item.newCommentData.lastTypedWord = {
						word: word,
						position: position
					};
				}
			}
		} else if (type === 'checkPlaceholder') {
			if (item.newCommentData.original.length === 0) {
				item.newCommentData.transformed = '<div class="placeholder">' + this.translations.common.commentPlaceholder + '</div>';
			}
		} else if (type === 'transformBeforeSend') {
			// Add replied user
			if (item.list.reply) {
				item.newCommentData.original = '@' + item.list.reply.child.user.username + ' ' + item.newCommentData.original;
			}

			const newData = {
				content: item.newCommentData.original,
				original: item.newCommentData.original,
				mentions: [],
				hashtags: []
			};

			// new line
			newData.content = newData.content.replace(/\n/g, '<br>');

			// hashtag
			newData.content = newData.content.replace(/(#)\w+/g, function (value) {
				return '<a class="hashtag">' + value + '</a>';
			});

			// mention
			newData.content = newData.content.replace(/(@)\w+/g, function (value) {
				newData.mentions.push(value);
				return '<a class="mention">' + value + '</a>';
			});

			// detect url
			newData.content = newData.content.replace(this.env.urlRegex, function (value) {
				return '<a class="url">' + value + '</a>';
			});

			return newData;
		} else if (type === 'create') {
			if (item.newCommentData.original.trim().length === 0) {
				this.alertService.warning(this.translations.common.isTooShort);
			} else {
				const formatedData = this.newComment('transformBeforeSend', null, item);
				const dataCreate = {
					id: item.id,
					type: 'text',
					content: formatedData.content,
					content_original: formatedData.original,
					reply: item.reply.id,
					mentions: formatedData.mentions
				};

				this.chatDataService.comment(dataCreate)
					.subscribe((res: any) => {
						item.noData = false;
						item.list.push(res);
						this.newComment('clear', null, item);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
			}
		}
	}

	// Caret position on contenteditable
	getCaretPosition(element) {
		const w3 = (typeof this.window.getSelection !== 'undefined') && true;
		let caretOffset = 0;

		if (w3) {
			const range = this.window.getSelection().getRangeAt(0);
			const preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		} else {
			this.alertService.error(this.translations.common.tryToUseAnotherBrowser);
		}

		return caretOffset;
	}

	// Get current typing word on contenteditable
	getCurrentWord(el, position) {
		// Get content of div
		const content = el.textContent;

		// Check if clicked at the end of word
		position = content[position] === ' ' ? position - 1 : position;

		// Get the start and end index
		let startPosition = content.lastIndexOf(' ', position);
		startPosition = startPosition === content.length ? 0 : startPosition;
		let endPosition = content.indexOf(' ', position);
		endPosition = endPosition === -1 ? content.length : endPosition;

		return content.substring(startPosition + 1, endPosition);
	}
}
