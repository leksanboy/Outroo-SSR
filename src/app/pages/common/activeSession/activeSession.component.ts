import { Component, AfterViewInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Location, PlatformLocation, DOCUMENT } from '@angular/common';
import { MatDialog, MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';

import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { NewPublicationComponent } from '../../../../app/pages/common/newPublication/newPublication.component';
import { NewPlaylistComponent } from '../../../../app/pages/common/newPlaylist/newPlaylist.component';
import { NewReportComponent } from '../../../../app/pages/common/newReport/newReport.component';
import { NewSessionComponent } from '../../../../app/pages/common/newSession/newSession.component';
import { ShowAvatarComponent } from '../../../../app/pages/common/showAvatar/showAvatar.component';
import { ShowMessageComponent } from '../../../../app/pages/common/showMessage/showMessage.component';
import { ShowLikesComponent } from '../../../../app/pages/common/showLikes/showLikes.component';
import { ActivePlayerMobileComponent } from '../../../../app/pages/common/activePlayerMobile/activePlayerMobile.component';
import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';
import { ActiveSessionsMobileComponent } from '../../../../app/pages/common/activeSessionsMobile/activeSessionsMobile.component';

import { NewShareComponent } from '../../../../app/pages/common/newShare/newShare.component';
import { ShowPlaylistComponent } from '../../../../app/pages/common/showPlaylist/showPlaylist.component';

declare var navigator: any;
declare var MediaMetadata: any;
declare var Vibrant: any;
declare var global: any;

@Component({
	selector: 'app-active-session',
	templateUrl: './activeSession.component.html',
	providers: [ TimeagoPipe ]
})
export class ActiveSessionComponent implements AfterViewInit {
	@ViewChild('audioPlayerHtml') audioPlayerHtml: ElementRef;

	public env: any = environment;
	public window: any = global;
	public sessionData: any;
	public translations: any;
	public dataNotifications: any;
	public navMenu: boolean;
	public deniedAccess = 'session';
	public showPlayer: boolean;
	public showSessions: boolean;
	public showNotificationsBox: boolean;
	public showUserBox: boolean;
	public showCloseSession: boolean;
	public showChangeSession: boolean;
	public showChangeTheme: boolean;
	public showChangeSessionOnMenu: boolean;
	public showChangeLanguage: boolean;
	public signingBox: boolean;
	public signOutCurrent: boolean;
	public audio: any;
	public audioPlayerData: any = {
		key: 0,
		repeat: false,
		shuffle: false,
		playing: false,
		loadingToPlay: false,
		equalizerInitialized: false,
		volume: {
			mute: false,
			beforeMuteValue: 75,
			value: 75
		},
		current: {
			title: 'Loading...',
			time: '0:00',
			duration: '0:00',
			image: '',
			key: 0,
			progress: 0,
			initialized: false,
			type: 'default',
			addRemoveSession: null,
			addRemoveOther: null,
			color: null
		},
		list: [],
		mini: false
	};

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		public dialog: MatDialog,
		private location: Location,
		private alertService: AlertService,
		private playerService: PlayerService,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private platformLocation: PlatformLocation,
		private audioDataService: AudioDataService,
		private followsDataService: FollowsDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService,
		private bottomSheet: MatBottomSheet,
		private ssrService: SsrService
	) {
		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(null);

		// iPhone X
		if (this.ssrService.isBrowser && this.window) {
			if (this.window.screen) {
				if (this.window.screen.height === 812 || this.window.screen.height === 2436) {
					this.document.body.classList.add('iphoneXClass');
				}
			}
		}

		// Return to home if no access
		if (!this.sessionData) {
			this.sessionData = [];
			this.sessionData.current = [];
			this.deniedAccess = 'none';

			// No tengo session y no puedo acceder a settings, notifications, news, home
			if (this.router.url === '/settings' || this.router.url === '/notifications' || this.router.url === '/news' || this.router.url === '/home') {
				this.userDataService.noSessionData();
			}
		} else {
			this.deniedAccess = 'session';

			// Set theme
			this.changeTheme(this.sessionData.current.theme);

			// Load default audios
			this.defaultAudios(this.sessionData.current.id);

			// Load default notifications
			this.defaultNotifications(this.sessionData.current.id);

			// Pending notifications
			this.pendingNotifications('default');

			// Pending notifications every 5 minutes
			setInterval(() => {
				this.pendingNotifications('default');
			}, 1000 * 60 * 5);

			// Get player data
			this.playerService.getData()
				.subscribe(data => {
					this.audioPlayerData.playlistBox = true;
					this.audioPlayerData.noData = false;
					this.audioPlayerData.postId = data.postId;
					this.audioPlayerData.list = data.list;
					this.audioPlayerData.item = data.item;
					this.audioPlayerData.key = data.key;
					this.audioPlayerData.user = data.user;
					this.audioPlayerData.username = data.username;
					this.audioPlayerData.location = data.location;
					this.audioPlayerData.type = data.type;
					this.audioPlayerData.selectedIndex = data.selectedIndex;
					this.audioPlayerData.current.key = -1;
					this.playPlayer('item', data.key);
				});

			// Get play/pause track
			this.playerService.getPlayTrack()
				.subscribe(data => {
					if (data.buttonType === 'next') {
						this.playPlayer('next', data.key);
					} else if (data.buttonType === 'prev') {
						this.playPlayer('prev', data.key);
					} else {
						this.playPlayer('item', data.key);
					}
				});

			// Get session data
			this.sessionService.getData()
				.subscribe(data => {
					this.sessionData = data;
					this.deniedAccess = data ? 'session' : 'none';

					// Get translations
					this.getTranslations(data.current.language);
				});

			// Get notification box close
			this.sessionService.getNotificationsBox()
				.subscribe(data => {
					this.showNotificationsBoxWeb(data);
				});

			// Get pending notifications
			this.sessionService.getPendingNotifications()
				.subscribe(data => {
					this.pendingNotifications('clear');
				});

			// Get session playlists
			this.sessionService.getDataPlaylists()
				.subscribe(data => {
					this.sessionData = data;
				});

			// Get session create playlist
			this.sessionService.getDataCreatePlaylist()
				.subscribe(data => {
					this.itemSongOptions('createPlaylist', data.item, null);
				});

			// Get session add account
			this.sessionService.getDataAddAccount()
				.subscribe(data => {
					if (data.type === 'create') {
						this.openNewSession();
					} else if (data.type === 'set') {
						this.setCurrentUser(data.data);
					} else if (data.type === 'close') {
						this.closeSession(data.data);
					}
				});

			// Get session data theme
			this.sessionService.getDataTheme()
				.subscribe(data => {
					this.changeTheme(data.value);
				});

			// Get report
			this.sessionService.getDataReport()
				.subscribe(data => {
					this.openReport(data);
				});

			// Get likers
			this.sessionService.getDataShowLikes()
				.subscribe(data => {
					this.openLikes(data);
				});

			// Get Share
			this.sessionService.getDataNewShare()
				.subscribe(data => {
					this.openShare(data);
				});

			// Get Message
			this.sessionService.getDataShowMessage()
				.subscribe(data => {
					this.openMessage(data);
				});

			// Get publication
			this.sessionService.getDataShowPublication()
				.subscribe(data => {
					this.showNotification(data);
				});

			// Get photo
			this.sessionService.getDataShowPhoto()
				.subscribe(data => {
					this.showNotification(data);
				});

			// Get avatar
			this.sessionService.getDataShowAvatar()
				.subscribe(data => {
					this.showAvatar(data);
				});

			// Get new publication
			this.sessionService.getDataNewPublication()
				.subscribe(data => {
					this.newPublication(data);
				});

			// Get copy to clipboard
			this.sessionService.getDataCopy()
				.subscribe(data => {
					this.copyToClipboard(data);
				});

			// Get href clicked
			this.sessionService.getDataClickElementRef()
				.subscribe(data => {
					this.clickElementRef(data);
				});

			// Pressed back
			this.platformLocation.onPopState(() => {
				this.location.go(this.router.url);
				this.showSessions = false;
				this.showPlayer = false;
			});
		}
	}

	// Audios player - document ready -> audio addEventListener
	ngAfterViewInit() {
		if (!this.ssrService.isBrowser) {
			return;
		}

		this.audio = this.audioPlayerHtml.nativeElement;

		const self = this;
		if (self.audio) {
			// Check if can play
			self.audio.addEventListener('canplay', function() {
				self.audioPlayerData.loadingToPlay = false;
				self.audio.play();
			});

			// Pause
			self.audio.addEventListener('pause', function() {
				self.playPlayer('pause', self.audioPlayerData.current.key);
			});

			// Playing
			self.audio.addEventListener('playing', function() {
				self.playPlayer('playing', self.audioPlayerData.current.key);

				if ('mediaSession' in navigator) {
					self.updateMetadata();
				}
			});

			// Progress bar and timing
			self.audio.addEventListener('timeupdate', function() {
				const countDown = Math.round(self.audio.duration - self.audio.currentTime);
				self.audioPlayerData.current.time = self.formatTime(self.audio.currentTime);
				self.audioPlayerData.loading = self.audio.currentTime > 0 ? false : true;

				const durationCountDown = self.formatTime(countDown);
				const radix = 10; // Hexadecimal
				self.audioPlayerData.current.duration = parseInt(durationCountDown.split(':')[1], radix) === 0 ? self.audioPlayerData.list[self.audioPlayerData.current.key].duration : durationCountDown;
				self.audioPlayerData.list[self.audioPlayerData.current.key].countdown = parseInt(durationCountDown.split(':')[1], radix) === 0 ? self.audioPlayerData.list[self.audioPlayerData.current.key].duration : durationCountDown;

				const progress = ((self.audio.currentTime / self.audio.duration) * 1000);
				self.audioPlayerData.current.progress = progress;
			});

			// Song endeed
			self.audio.addEventListener('ended', function() {
				let key;

				if (self.audioPlayerData.repeat) {
					key = self.audioPlayerData.current.key;
				} else {
					if (self.audioPlayerData.shuffle) {
						key = Math.floor(Math.random() * self.audioPlayerData.list.length) + 0;
					} else {
						key = (self.audioPlayerData.list.length === self.audioPlayerData.current.key + 1) ? 0 : self.audioPlayerData.current.key + 1;
					}
				}

				// Check if is ad item
				if (self.audioPlayerData.list[key].contentTypeAd || self.audioPlayerData.list[key].id === 0) {
					key = key + 1;
				}

				self.playPlayer('item', key);
			});
		}

		// Mediasession generate background player
		if ('mediaSession' in navigator) {
			navigator.mediaSession.setActionHandler('play', function() {
				self.playPlayer('playing', self.audioPlayerData.current.key);
				self.updateMetadata();
			});
			navigator.mediaSession.setActionHandler('pause', function() {
				self.playPlayer('pause', self.audioPlayerData.current.key);
				self.updateMetadata();
			});
			navigator.mediaSession.setActionHandler('previoustrack', function() {
				self.playPlayer('prev', self.audioPlayerData.current.key);
				self.updateMetadata();
			});
			navigator.mediaSession.setActionHandler('nexttrack', function() {
				self.playPlayer('next', self.audioPlayerData.current.key);
				self.updateMetadata();
			});
		}
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Scroll to top
	scrollTop() {
		this.window.scrollTo(0, 0);
	}

	// Update session data
	updateSessionDataFromSettings(data) {
		this.sessionData = data;
	}

	// Set come from user button
	setComeFromUserButton() {
		setTimeout(() => {
			this.sessionService.setComeFromUserButton(true);
		}, 100);
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
	}

	// Default audios
	defaultAudios(user) {
		const data = {
			user: user,
			type: 'default',
			rows: 0,
			cuantity: this.env.cuantity
		};

		this.audioDataService.default(data)
			.subscribe((res: any) => {
				if (!res || res.length === 0) {
					this.audioPlayerData.noData = true;
					this.audioPlayerData.current.title = this.translations.audios.uploadOrSearch;
				} else {
					this.audioPlayerData.noData = false;
					this.audioPlayerData.list = res;
					this.audioPlayerData.current.original_title = res[0].original_title ? res[0].original_title : res[0].title;
					this.audioPlayerData.current.original_artist = res[0].original_artist ? res[0].original_artist : res[0].title;
					this.audioPlayerData.current.duration = res[0].duration;
					this.audioPlayerData.current.image = res[0].image ? (this.env.pathAudios + 'thumbnails/' + res[0].image) : '';
					this.audioPlayerData.item = res[0];
					this.audioPlayerData.key = 0;
					this.audioPlayerData.user = this.sessionData.current.id;
					this.audioPlayerData.username = this.sessionData.current.username;
					this.audioPlayerData.location = 'user';
					this.audioPlayerData.type = 'default';
					this.audioPlayerData.selectedIndex = 0;
				}
			});
	}

	// Pending notifications
	pendingNotifications(type) {
		if (type === 'default') {
			const dataP = {
				type: 'default'
			};

			this.notificationsDataService.pending(dataP)
				.subscribe(res => {
					this.sessionData.current.countPendingNotifications = res;

					// Get data to notifications box
					if (res > 0) {
						this.defaultNotifications(this.sessionData.current.id);
					}
				});
		} else if (type === 'clear') {
			this.sessionData.current.countPendingNotifications = 0;

			for (const i of this.dataNotifications.list) {
				if (i) {
					i.is_seen = 1;
				}
			}
		}
	}

	// Default notifications (last week)
	defaultNotifications(user) {
		this.dataNotifications = {
			list: [],
			rows: 0,
			loadingData: true,
			loadMoreData: false,
			loadingMoreData: false,
			noMore: false
		};

		const data = {
			user: user,
			type: 'box',
			rows: this.dataNotifications.rows,
			cuantity: this.env.cuantity / 3
		};

		this.notificationsDataService.default(data)
			.subscribe((res: any) => {
				this.dataNotifications.loadingData = false;

				if (!res || res.length === 0) {
					this.dataNotifications.noMore = true;
				} else {
					this.dataNotifications.list = res;
				}
			}, error => {
				this.dataNotifications.loadingData = false;
				this.dataNotifications.noMore = true;
			});
	}

	// Show notifications web
	showNotificationsBoxWeb(type) {
		if (type === 'show') {
			this.showNotificationsBox = !this.showNotificationsBox;

			// Count to '0'
			this.sessionData.current.countPendingNotifications = 0;

			// Update seen
			if (this.dataNotifications.list.filter(x => x.is_seen == 0).length) {
				const dataP = {
					type: 'update'
				};

				this.notificationsDataService.pending(dataP).subscribe();
			}

			for (const i of this.dataNotifications.list) {
				if (i) {
					setTimeout(() => {
						i.is_seen = 1;
					}, 1800);
				}
			}
		} else if (type === 'close') {
			this.showNotificationsBox = false;
		}
	}

	// Show photo from url if is one
	showNotification(item) {
		if (item.url === 'publication') {
			const data = {
				name: item.contentData.name,
				session: this.sessionData.current.id
			};

			this.publicationsDataService.getPost(data)
				.subscribe((res: any) => {
					this.location.go('/p/' + data.name);

					const config = {
						disableClose: false,
						data: {
							comeFrom: 'notifications',
							translations: this.translations,
							sessionData: this.sessionData,
							userData: (res ? res.user : null),
							item: (res ? res : null)
						}
					};

					// Open dialog
					const dialogRef = this.dialog.open(ShowPublicationComponent, config);
					dialogRef.afterClosed().subscribe((result: any) => {
						this.location.go(this.router.url);
					});
				});
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

	// Show avatar
	showAvatar(data) {
		this.location.go(this.router.url + '#avatar');

		const config = {
			disableClose: false,
			data: {
				translations: this.translations,
				userData: data.userData,
			}
		};

		// Open dialog
		const dialogRef = this.dialog.open(ShowAvatarComponent, config);
		dialogRef.afterClosed().subscribe((result: any) => {
			this.location.go(this.router.url);
		});
	}

	// New publication
	newPublication(data) {
		if (data.type === 'new') {
			this.location.go(this.router.url + '#publication');

			const config = {
				disableClose: false,
				data: {
					translations: this.translations,
					sessionData: this.sessionData
				}
			};

			// Open dialog
			const dialogRef = this.dialog.open(NewPublicationComponent, config);
			dialogRef.afterClosed().subscribe((result: any) => {
				this.location.go(this.router.url);

				if (result) {
					const res = {
						type: 'result',
						data: result
					};

					this.sessionService.setDataNewPublication(res);
				}
			});
		}
	}

	// Listener click on href
	clickElementRef(event) {
		if (event.target.className === 'mention') {
			const user = event.target.innerText.substring(1);
			this.router.navigate([user]);
		} else if (event.target.className === 'hashtag') {
			// Close all dialogs
			this.dialog.closeAll();

			// Data
			const hash = 'news/' + event.target.innerText.substring(1);
			this.router.navigate([hash]);
		} else if (event.target.className === 'url') {
			this.window.open(event.target.innerText, '_blank');
		}
	}

	// Player buttons
	playPlayer(type, key) {
		switch (type) {
			case('item'):
				if (this.audioPlayerData.current.key === key &&
					this.audioPlayerData.current.user === this.audioPlayerData.user &&
					this.audioPlayerData.current.type === this.audioPlayerData.type
				) { // Play/pause current
					if (this.audioPlayerData.playing === false) {
						this.audioPlayerData.item.playing = true;
						this.audioPlayerData.list[key].playing = true;
						this.audioPlayerData.playing = true;
						this.audio.play();
					} else {
						this.audioPlayerData.item.playing = false;
						this.audioPlayerData.list[key].playing = false;
						this.audioPlayerData.playing = false;
						this.audio.pause();
					}
				} else { // Play new one
					if (!this.audioPlayerData.equalizerInitialized) {
						this.audioPlayerData.equalizerInitialized = true;
						this.initEqualizer();
					}

					this.playPlayer('stop', null);
					this.audioPlayerData.current.initialized = true;

					for (const i in this.audioPlayerData.list) {
						if (i) {
							this.audioPlayerData.list[i].playing = false;
						}
					}

					this.audioPlayerData.list[key].playing = true;
					this.audioPlayerData.loadingToPlay = true;
					this.audioPlayerData.loading = true;
					this.audioPlayerData.playing = true;
					this.audioPlayerData.current.user = this.audioPlayerData.user;
					this.audioPlayerData.current.type = this.audioPlayerData.type;
					this.audioPlayerData.current.key = key;
					this.audioPlayerData.current.item = this.audioPlayerData.list[key];
					this.audioPlayerData.current.original_artist = this.audioPlayerData.list[key].original_artist ? this.audioPlayerData.list[key].original_artist : this.audioPlayerData.list[key].title;
					this.audioPlayerData.current.original_title = this.audioPlayerData.list[key].original_title ? this.audioPlayerData.list[key].original_title : this.audioPlayerData.list[key].title;
					this.audioPlayerData.current.duration = this.audioPlayerData.list[key].duration;
					this.audioPlayerData.current.image = this.audioPlayerData.list[key].image ? (this.env.pathAudios + 'thumbnails/' + this.audioPlayerData.list[key].image) : '';
					this.audio.src = this.env.pathAudios + this.audioPlayerData.list[key].name;
					this.audio.load();
					this.getColorFromAudioCover(this.audioPlayerData.current.image);

					// Replays +1
					this.updateReplays(this.audioPlayerData.list[key].song, this.sessionData.current.id, this.audioPlayerData.playlist);

					// Set current track
					this.audioPlayerData.location = this.audioPlayerData.location ? this.audioPlayerData.location : 'user';
					this.audioPlayerData.item = this.audioPlayerData.list[key];
					this.audioPlayerData.list = this.audioPlayerData.list;
					this.audioPlayerData.key = key;
					this.audioPlayerData.postId = this.audioPlayerData.postId;
					this.audioPlayerData.type = this.audioPlayerData.type;
					this.audioPlayerData.user = this.audioPlayerData.user;
					this.audioPlayerData.username = this.audioPlayerData.username;
					this.audioPlayerData.selectedIndex = this.audioPlayerData.selectedIndex;
				}

				// Set to service
				this.playerService.setCurrentTrack(this.audioPlayerData);

				// Set to session
				this.sessionData.current.audioPlayerData = this.audioPlayerData;
				this.userDataService.setSessionData('data', this.sessionData);
			break;
			case('play'):
				this.playPlayer('item', this.audioPlayerData.current.key);
			break;
			case('playing'):
				this.audioPlayerData.list[key].playing = true;
				this.audioPlayerData.playing = true;
				this.audio.play();
			break;
			case('pause'):
				this.audioPlayerData.list[key].playing = false;
				this.audioPlayerData.playing = false;
				this.audio.pause();
			break;
			case('prev'):
				let prevKey;

				if (this.audioPlayerData.shuffle) {
					prevKey = Math.floor(Math.random() * this.audioPlayerData.list.length) + 0;
				} else {
					prevKey = (this.audioPlayerData.current.key === 0) ? (this.audioPlayerData.list.length - 1) : (this.audioPlayerData.current.key - 1);
				}

				// Check if is ad item
				if (this.audioPlayerData.list[prevKey].contentTypeAd || this.audioPlayerData.list[prevKey].id === 0) {
					prevKey = prevKey - 1;
				}

				this.playPlayer('item', prevKey);
			break;
			case('next'):
				let nextKey;

				if (this.audioPlayerData.shuffle) {
					nextKey = Math.floor(Math.random() * this.audioPlayerData.list.length) + 0;
				} else {
					nextKey = (this.audioPlayerData.current.key === this.audioPlayerData.list.length - 1) ? 0 : (this.audioPlayerData.current.key + 1);
				}

				// Check if is ad item
				if (this.audioPlayerData.list[nextKey].contentTypeAd || this.audioPlayerData.list[nextKey].id === 0) {
					// Check if last element of the list is ad
					if (this.audioPlayerData.list[this.audioPlayerData.list.length - 1].contentTypeAd || this.audioPlayerData.list[this.audioPlayerData.list.length - 1].id === 0) {
						nextKey = 0;
					} else {
						nextKey = nextKey + 1;
					}
				}

				this.playPlayer('item', nextKey);
			break;
			case('stop'):
				this.audio.pause();
				this.audio.currentTime = 0;
			break;
			case('shuffle'):
				this.audioPlayerData.shuffle = !this.audioPlayerData.shuffle;
			break;
			case('repeat'):
				this.audioPlayerData.repeat = !this.audioPlayerData.repeat;
			break;
		}
	}

	// Play item song
	playSong(data, item, key, type) {
		if (!this.sessionData) {
			this.alertService.success(this.translations.common.createAnAccountToListenSong);
		} else {
			if (item.id === 0) {
				this.alertService.warning(this.translations.common.songNotUploaded);
			} else {
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
					this.audioPlayerData.user = this.sessionData.current.id;
					this.audioPlayerData.username = this.sessionData.current.username;
					this.audioPlayerData.location = 'playlist';
					this.audioPlayerData.type = type;
					this.audioPlayerData.selectedIndex = null;

					this.playerService.setData(this.audioPlayerData);
					item.playing = true;
				}
			}
		}
	}

	// Replays +1
	updateReplays(id, user, playlist) {
		const data = {
			id: id,
			user: user,
			playlist: playlist
		};

		this.audioDataService.updateReplays(data).subscribe();
	}

	// Audio player on background screen
	updateMetadata() {
		if (!this.ssrService.isBrowser) {
			return;
		}

		navigator.mediaSession.metadata = new MediaMetadata({
			title: this.audioPlayerData.current.original_title,
			artist: this.audioPlayerData.current.original_artist,
			album: this.audioPlayerData.username,
			artwork: [{
				src: this.audioPlayerData.current.image, sizes: '512x512', type: 'image/jpeg'
			}]
		});
	}

	// Time format
	formatTime(time) {
		const duration = time,
			hours = Math.floor(duration / 3600),
			minutes = Math.floor((duration % 3600) / 60),
			seconds = Math.floor(duration % 60),
			result = [];

		if (hours) {
			result.push(hours);
		}

		result.push(((hours ? '0' : '') + (minutes ? minutes : 0)).substr(-2));
		result.push(('0' + (seconds ? seconds : 0)).substr(-2));

		return result.join(':');
	}

	// Progress bar
	progressBar(event) {
		let time = ((event.value / 1000) * this.audio.duration);

		if (time) {
			this.audio.currentTime = time;
		}
	}

	// Volume bar
	volumeBar(type, event) {
		if (type === 'progress') {
			this.audioPlayerData.volume.mute = (event.value === 0) ? true : false;
			this.audio.volume = event.value / 100;
			this.audioPlayerData.volume.value = event.value;
		} else if (type === 'save') {
			if (event.value > 1) {
				this.audioPlayerData.volume.beforeMuteValue = event.value;
			}
		} else if (type === 'mute') {
			this.audioPlayerData.volume.mute = !this.audioPlayerData.volume.mute;
			this.audioPlayerData.volume.value = this.audioPlayerData.volume.mute ? 0 : this.audioPlayerData.volume.beforeMuteValue;
			this.audio.volume = this.audioPlayerData.volume.mute ? 0 : (this.audioPlayerData.volume.beforeMuteValue / 100);
		}
	}

	// Equalizer
	initEqualizer() {
		const self = this;

		if ('AudioContext' in self.window) {
			let canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height, gradient;
			context = new AudioContext();
			analyser = context.createAnalyser();
			canvas = this.document.getElementById('audioAnalyser');
			ctx = canvas.getContext('2d');

			gradient = ctx.createLinearGradient(0, 0, 0, 1);
			gradient.addColorStop(1, 'rgb(158,158,158)');
			// gradient.addColorStop(0.25, 'rgba(0,0,0,0.15)');
			source = context.createMediaElementSource(self.audio);
			source.connect(analyser);
			analyser.connect(context.destination);

			const frameLooper = function() {
				// self.window.webkitRequestAnimationFrame(frameLooper);
				self.window.requestAnimationFrame(frameLooper);
				fbc_array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(fbc_array);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = gradient; // Color of the bars
				bars = 100;

				for (let i = 0; i < bars; i++) {
					bar_x = i * 3;
					bar_width = 2;
					bar_height = -(fbc_array[i] / 2);
					ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
				}
			};

			frameLooper();
		}
	}

	// Item audios options
	itemSongOptions(type, item, playlist) {
		switch (type) {
			case('addRemoveSession'):
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				const dataARS = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'session',
					id: item.id
				};

				this.audioDataService.addRemove(dataARS)
					.subscribe(res => {
						const song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = !item.addRemoveSession ? (' ' + this.translations.common.hasBeenAdded) : (' ' + this.translations.common.hasBeenRemoved);

						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case('addRemoveUser'):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				const dataARO = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.song
				};

				this.audioDataService.addRemove(dataARO)
					.subscribe((res: any) => {
						item.insertedId = res;

						const song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
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
		}
	}

	// Get color
	getColorFromAudioCover(image) {
		const self = this;

		if (image.length) {
			let img = this.document.createElement('img');
			img.setAttribute('src', image);

			if (img.hasAttribute('src')) {
				let vibrant = new Vibrant(img);
				let swatches = vibrant.swatches();

				for (const i in swatches) {
					if (i) {
						if (swatches.hasOwnProperty(i) && swatches[i]) {
							if (i === 'Vibrant') {
								self.audioPlayerData.current.color = swatches[i].getHex();
							}
						}
					}
				}
			}
		} else {
			self.audioPlayerData.current.color = null;
		}
	}

	// Show Player on Mobile
	showMobilePlayer(type) {
		const config = {
			data: {
				sessionData: this.sessionData,
				playerData: this.audioPlayerData,
				translations: this.translations,
				audio: this.audio
			}
		};

		// Set sheet
		const bottomSheetRef = this.bottomSheet.open(ActivePlayerMobileComponent, config);
		bottomSheetRef.afterDismissed().subscribe(val => {
			// no actions
		});
	}

	// Show playlist web
	showPlaylistWeb() {
		this.showUserBox = false;
		this.audioPlayerData.playlistBox = !this.audioPlayerData.playlistBox;
	}

	// Show userBox web
	showUserBoxWeb() {
		this.showUserBox = !this.showUserBox;
		this.showCloseSession = false;
		this.showChangeSession = false;
		this.showChangeLanguage = false;
		this.audioPlayerData.playlistBox = false;
	}

	// Show panel from bottom on mobile
	showSessionPanelFromBottom() {
		this.showPlayer = false;

		// Config
		const config = {
			data: {
				sessionData: this.sessionData
			}
		};

		// Set sheet
		const bottomSheetRef = this.bottomSheet.open(ActiveSessionsMobileComponent, config);
		bottomSheetRef.afterDismissed().subscribe(val => {
			// no actions
		});
	}

	// Add another session
	openNewSession() {
		this.location.go(this.router.url + '#AddAccount');

		const config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				translations: this.translations
			}
		};

		const dialogRef = this.dialog.open(NewSessionComponent, config);
		dialogRef.afterClosed().subscribe((res: string) => {
			this.location.go(this.router.url);

			if (res) {
				this.sessionData.sessions.push(res);
				this.setCurrentUser(res);
			}
		});
	}

	// Set session
	setCurrentUser(data) {
		if (this.sessionData.current.id !== data.id) {
			// Set theme
			this.changeTheme(data.theme);

			// Get translations
			this.getTranslations(data.language);

			// Set data
			this.sessionData.current = data;
			this.sessionService.setData(this.sessionData);

			// Session set
			this.sessionData = this.userDataService.setSessionData('data', this.sessionData);
			this.showSessions = false;
			this.showChangeSessionOnMenu = false;
			this.showChangeSession = false;
			this.showUserBox = false;

			// Get notifications
			this.defaultNotifications(this.sessionData.current);

			// Get pending notifications
			this.pendingNotifications('default');

			// Go to main page
			this.router.navigate([data.username]);

			// AutoScroll top
			if (this.ssrService.isBrowser) {
				this.scrollTop();
			}

			// Alert message
			this.alertService.success(this.translations.common.accountChangedTo + ' @' + data.username);
		}
	}

	// Close session
	closeSession(data) {
		if (this.sessionData.sessions.length === 1) {
			this.playPlayer('stop', null);
			this.router.navigate(['logout']);
			this.userDataService.logout();
		} else {
			for (const i in this.sessionData.sessions) {
				if (i) {
					if (this.sessionData.sessions[i].id === data.id) {
						this.sessionData.sessions.splice(i, 1);
					}
				}
			}

			// Set sessions
			this.userDataService.setSessionData('data', this.sessionData);
			this.sessionService.setData(this.sessionData);

			// Set different account and check if is not set and deleted
			let session = this.sessionData.current.id === data.id ? this.sessionData.sessions[0] : this.sessionData.current;
			this.setCurrentUser(session);
		}
	}

	// Change language
	changeLanguage(lang) {
		if (this.sessionData.current.language !== lang.id) {
			this.userDataService.updateLanguage(lang.id)
				.subscribe(res => {
					// Close user box
					this.showChangeLanguage = false;
					this.showUserBox = false;

					// Set data
					this.sessionData.current.language = lang.id;
					this.sessionService.setDataLanguage(lang.id);

					// Set translations
					this.getTranslations(this.sessionData.current.language);

					// Alert
					this.alertService.success(this.translations.common.languageChanged);
				}, error => {
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Dark theme
	changeTheme(value) {
		// Set theme
		if (value === 0) {
			this.document.body.classList.remove('darkTheme');
			this.document.getElementsByTagName('html')[0].setAttribute('class', 'light');
		} else if (value === 1) {
			this.document.body.classList.add('darkTheme');
			this.document.getElementsByTagName('html')[0].setAttribute('class', 'dark');
		}

		// Close user box
		this.showChangeTheme = false;
		this.showUserBox = false;

		const data = {
			id: this.sessionData.current.id,
			theme: value
		};

		this.userDataService.updateTheme(data).subscribe();
	}

	// Report inapropiate content
	openReport(data) {
		this.location.go(this.router.url + '#report');

		// if (data.type === 'publication') {
		// } else if (data.type === 'publicationComment') {
		// } else if (data.type === 'photo') {
		// } else if (data.type === 'photoComment') {
		// } else if (data.type === 'audio') {
		// } else if (data.type === 'audioPlaylist') {
		// } else if (data.type === 'chat') {
		// }

		const config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				translations: this.translations,
				item: data
			}
		};

		const dialogRef = this.dialog.open(NewReportComponent, config);
		dialogRef.afterClosed().subscribe((res: string) => {
			this.location.go(this.router.url);
		});
	}

	// Likers
	openLikes(data) {
		this.location.go(this.router.url + '#likers');

		const config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				translations: this.translations,
				item: data
			}
		};

		const dialogRef = this.dialog.open(ShowLikesComponent, config);
		dialogRef.afterClosed().subscribe((res: string) => {
			this.location.go(this.router.url);
		});
	}

	// Share
	openShare(data) {
		// Open Share if is closed because on the other hand we set on dataList new Share
		// or last inserted comment on one Share
		if (!data.close) {
			this.location.go(this.router.url + '#' + data.comeFrom);

			const config = {
				disableClose: false,
				data: {
					sessionData: this.sessionData,
					translations: this.translations,
					item: data,
					comeFrom: data.comeFrom
				}
			};

			const dialogRef = this.dialog.open(NewShareComponent, config);
			dialogRef.afterClosed().subscribe((res: any) => {
				// Check if is new chat with content or last insered comment
				if (res.close) {
					this.sessionService.setDataNewShare(res);
				}

				// Set url
				this.location.go(this.router.url);
			});
		}
	}

	// Message
	openMessage(data) {
		this.location.go(this.router.url + '#sendMessage');

		const config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				userData: data,
				translations: this.translations
			}
		};

		const dialogRef = this.dialog.open(ShowMessageComponent, config);
		dialogRef.afterClosed().subscribe((res: any) => {
			// Set url
			this.location.go(this.router.url);
		});
	}

	// Copy to clipboard
	copyToClipboard(data) {
		const selBox = this.document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.opacity = '0';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.value = data;
		this.document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		this.document.execCommand('copy');
		this.document.body.removeChild(selBox);

		this.alertService.success(this.translations.common.copied);
	}

	// Mini player
	doMiniPlayer(type) {
		if (type === 'collapse') {
			this.audioPlayerData.mini = true;
			this.audioPlayerData.playlistBox = false
		} else if (type === 'expand') {
			this.audioPlayerData.mini = false;
		}
	}
}
