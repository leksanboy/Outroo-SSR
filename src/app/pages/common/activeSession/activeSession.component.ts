import { Component, OnInit, AfterViewInit, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Location, PlatformLocation, DOCUMENT } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatBottomSheet } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
import { ShowChatComponent } from '../showChat/showChat.component';
import { ShowLikesComponent } from '../../../../app/pages/common/showLikes/showLikes.component';
import { ActivePlayerMobileComponent } from '../../../../app/pages/common/activePlayerMobile/activePlayerMobile.component';
import { showPostComponent } from '../../../../app/pages/common/showPost/showPost.component';
import { ActiveSessionsMobileComponent } from '../../../../app/pages/common/activeSessionsMobile/activeSessionsMobile.component';

import { NewShareComponent } from '../../../../app/pages/common/newShare/newShare.component';
import { ShowPlaylistComponent } from '../../../../app/pages/common/showPlaylist/showPlaylist.component';

declare var navigator: any;
declare var MediaMetadata: any;
declare var global: any;
declare var FB: any;
declare var gapi: any;

@Component({
	selector: 'app-active-session',
	templateUrl: './activeSession.component.html',
	providers: [ TimeagoPipe ],
	animations: [
		trigger('slideInOut', [
			transition(':enter', [
				style({ transform: 'translateX(0%)' }),
				animate('300ms ease-in', style({ transform: 'translateX(0%)', opacity: 1 }))
			]),
			transition(':leave', [
				animate('300ms ease-in', style({ transform: 'translateX(-10%)', opacity: 0 }))
			])
		])
	]
})
export class ActiveSessionComponent implements OnInit, AfterViewInit {
	@ViewChild('audioPlayerHtml') audioPlayerHtml: ElementRef;
	@ViewChild('searchInput') searchInput: ElementRef;
	@ViewChild('searchResults') searchResults: ElementRef;

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
			color: null,
			shadow: null
		},
		list: [],
		mini: false
	};
	public activeRouter: any;
	public socialLoading: boolean;
	public recommendedUsers: any = {};
	public recommendedSongs: any = {};
	public actionFormSearch: FormGroup;
	public dataSearch: any = [];
	public colors = ['yellow', 'purple', 'blue', 'red', 'green'];
	public randColor = this.colors[Math.floor(Math.random() * 5) + 0];

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private _fb: FormBuilder,
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
		private ssrService: SsrService,
		private renderer: Renderer2
	) {
		// Close clicking outside of box
		this.renderer.listen('window', 'click',(e: Event) => {
			let si = this.searchInput 	? (this.searchInput.nativeElement || false) : false;
			let sr = this.searchResults ? (this.searchResults.nativeElement || false) : false;

			if (e.target !== si && e.target !== sr) {
				this.search('close', null);
			}

			/* 
			if (e.target !== nb && e.target !== nx) {
				this.showNotificationsBoxWeb('close');
			}

			if (e.target !== ub && e.target !== ux) {
				this.showUserBox = false;
			}
			*/
	   });

		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(null);

		// iPhone X
		if (this.ssrService.isBrowser && this.window) {
			if (this.window.screen) {
				if (this.window.screen.height === 812 || // iPhone X, Xs, 11 Pro
					this.window.screen.height === 896 || // iPhone 11, 11 Pro Max, Xs, Xs Max
					this.window.screen.height === 2436)
				{
					this.document.body.classList.add('iphoneXClass');
				}
			}
		}

		// Get player data
		this.playerService.getData()
			.subscribe(data => {
				this.audioPlayerData.noData = false;
				this.audioPlayerData.postId = data.postId;
				this.audioPlayerData.list = data.list;
				this.audioPlayerData.item = data.item;
				this.audioPlayerData.key = data.key;
				this.audioPlayerData.location = data.location;
				this.audioPlayerData.type = data.type;
				this.audioPlayerData.selectedIndex = data.selectedIndex;
				this.audioPlayerData.current.key = -1;
				this.audioPlayerData.current.color = data.color;
				this.audioPlayerData.current.background = data.color ? ('rgb(' + data.color + ')') : null;
				this.audioPlayerData.current.shadow = data.color ? ('0 10px 30px rgba(' + data.color + ', 0.37)') : null;
				this.playPlayer('item', data.key);
			});

		// Get play/pause track
		this.playerService.getPlayTrack()
			.subscribe(data => {
				this.audioPlayerData = data;

				if (data.buttonType === 'next') {
					this.playPlayer('next', data.key);
				} else if (data.buttonType === 'prev') {
					this.playPlayer('prev', data.key);
				} else {
					this.playPlayer('item', data.key);
				}
			});

		// Get player data
		this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});

		// Get cover data
		this.playerService.getCoverTrack()
			.subscribe(data => {
				console.log('cover data:', data);

				if (data.type === 'song') {
					this.audioPlayerData.current.color = data.color;
					this.audioPlayerData.current.background = this.audioPlayerData.current.color ? ('rgb(' + data.color + ')') : null;
					this.audioPlayerData.current.shadow = this.audioPlayerData.current.color ? ('0 10px 30px rgba(' + data.color + ', 0.37)') : null;
				}
			});

		// Get social login
		this.sessionService.getSocialLogin()
			.subscribe(data => {
				this.socialLogin(data, null, null);
			});

		// Return to home if no access
		if (!this.sessionData) {
			this.activeRouter = this.router.events.subscribe(event => {
				if (event instanceof NavigationEnd) {
					this.deniedAccess = (event.url === '/' || 
										event.url === '/signin' || 
										event.url === '/signup' || 
										event.url === '/forgot-password' ||
										event.url === '/reset-password' ||
										event.url === '/confirm-email' ||
										event.url === '/logout' ||
										event.url === '/about' ||
										event.url === '/privacy' ||
										event.url === '/support'
					) ? 'home' : 'none';
				}
			});

			// No tengo session y no puedo acceder a settings, notifications, news, home
			if (this.router.url === '/settings' ||
				this.router.url === '/notifications' ||
				this.router.url === '/news' ||
				this.router.url === '/home') 
			{
				this.userDataService.noSessionData();
			}
		} else {
			this.deniedAccess = 'session';

			// Search
			this.actionFormSearch = this._fb.group({
				caption: ['']
			});

			// Get recommended
			this.getRecommendedUsersSongs();

			// Set theme
			this.changeTheme('init', this.sessionData.current.theme);

			// Load default audios
			this.defaultAudios(this.sessionData.current.id);

			// Load default notifications
			this.defaultNotifications(this.sessionData.current.id);

			// Pending notifications
			this.pendingNotifications('default');

			// Pending notifications every 5 minutes
			/* setInterval(() => {
				this.pendingNotifications('default');
			}, 1000 * 60 * 5); */

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
					this.changeTheme('update', data.value);
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

			// Get Chat
			this.sessionService.getDataShowChat()
				.subscribe(data => {
					this.openChat(data);
				});

			// Get publication
			this.sessionService.getDatashowPost()
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

		/* var host = 'wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self';
        var socket = new WebSocket(host);
        socket.onmessage = function(e) {
            console.log('WS - e:', e);
			console.log('WS - e.data:', e.data);
        }; */

		
	}

	ngOnInit() {
		const self = this;

		if (!this.sessionData) {
			/* Facebook load script */
			(window as any).fbAsyncInit = function() {
				FB.init({
					appId      : '506676413809707',
					cookie     : true,
					xfbml      : true,
					version    : 'v11.0'
				});
					
				FB.AppEvents.logPageView();   
			};
		
			(function(d, s, id){
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {return;}
				js = d.createElement(s); js.id = id;
				js.src = "https://connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));

			/* Google load */
			gapi.load('auth2', function() {
				let auth2 = gapi.auth2.init({
					client_id: '300059601874-7tomgilbgemad0d0k93i01pjq785a98u.apps.googleusercontent.com',
					cookiepolicy: 'single_host_origin',
					scope: 'profile email'
				});

				let element = document.getElementById('googleSignIn');
				self.socialLogin('google', auth2, element);
			});
		} else {
			// Search/Reset
			this.actionFormSearch.controls['caption'].valueChanges
				.pipe(
					debounceTime(400),
					distinctUntilChanged())
				.subscribe(val => {
					(val.trim().length > 0) ? this.search('default', val) : this.search('clear', null);
				});
		}

		var host2 = 'ws://localhost:8888';
		//var host2 = 'wss://beatfeel.com:8888';
        var socket2 = new WebSocket(host2);
        socket2.onopen = function(e) {
            console.log('WS2 - onopen:', e);
        };
		socket2.onmessage = function(e) {
            console.log('WS2 - onmessage:', e);
        };
		socket2.onclose = function(e) {
            console.log('WS2 - onclose:', e);
        };
		socket2.onerror = function(e) {
            console.log('WS2 - onerror:', e);
        };
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
				// First 30 seconds for free then create an account
				if (!self.sessionData && self.audio.currentTime >= 30) {
					if (!self.audioPlayerData.current.freeExprired) {
						self.playPlayer('pause', self.audioPlayerData.current.key);
						self.audioPlayerData.current.freeExprired = true;
						self.alertService.success(self.translations.common.createAnAccountToListenSong);
						return;
					} else {
						self.audioPlayerData.current.freeExprired = false;
					}
				}

				// Countdown
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

	// Search
	search(type, value) {
		if (type === 'default') {
			this.dataSearch.show = true;
			this.dataSearch.list = null;
			this.dataSearch.noData = null;
			this.dataSearch.loadingData = true;
			this.dataSearch.value = value;

			const data = {
				caption: value,
				rows: 0,
				cuantity: this.env.cuantity
			};

			this.followsDataService.search(data)
				.subscribe((res: any) => {
					this.dataSearch.loadingData = false;

					if (!res || res.length === 0) {
						this.dataSearch.noData = true;
					} else {
						this.dataSearch.list = res;
					}
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'clear') {
			this.actionFormSearch.get('caption').setValue('');
			this.dataSearch.list = null;
			this.dataSearch.noData = null;
		} else if (type === 'close') {
			this.dataSearch.show = false;
		} else if (type === 'show') {
			if (this.dataSearch.list) {
				this.dataSearch.show = true;
			}
		}
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
					this.audioPlayerData.current.item = res[0];
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

			// Close searchBox
			//this.search('close', null);

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
					const dialogRef = this.dialog.open(showPostComponent, config);
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
					/* this.audioPlayerData.current.user === this.audioPlayerData.user && */
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

						/* if (this.sessionData) {
							if (this.sessionData.current) {
								this.initEqualizer();
							}
						} */
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
					this.audioPlayerData.current.type = this.audioPlayerData.type;
					this.audioPlayerData.current.key = key;
					this.audioPlayerData.current.item = this.audioPlayerData.list[key];
					this.audioPlayerData.current.original_artist = this.audioPlayerData.list[key].original_artist ? this.audioPlayerData.list[key].original_artist : this.audioPlayerData.list[key].title;
					this.audioPlayerData.current.original_title = this.audioPlayerData.list[key].original_title ? this.audioPlayerData.list[key].original_title : this.audioPlayerData.list[key].title;
					this.audioPlayerData.current.duration = this.audioPlayerData.list[key].duration;
					this.audioPlayerData.current.image = this.audioPlayerData.list[key].image ? (this.env.pathAudios + 'thumbnails/' + this.audioPlayerData.list[key].image) : '';
					this.audio.src = this.env.pathAudios + this.audioPlayerData.list[key].name;
					this.audio.load();
					this.audioPlayerData.current.color = this.audioPlayerData.current.image ? this.audioDataService.getCoverColor('song', this.audioPlayerData.current.image) : null;

					// Replays +1
					this.updateReplays(this.audioPlayerData.list[key].song, (this.sessionData ? this.sessionData.current.id : 0), this.audioPlayerData.playlist);

					// Set current track
					this.audioPlayerData.location = this.audioPlayerData.location ? this.audioPlayerData.location : 'user';
					this.audioPlayerData.item = this.audioPlayerData.list[key];
					this.audioPlayerData.key = key;
				}

				// Set to service
				this.playerService.setCurrentTrack(this.audioPlayerData);

				/* // Set to storage
				this.sessionData.audioPlayerData = this.audioPlayerData;
				this.userDataService.setSessionData('data', this.sessionData); */
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
				this.audioPlayerData.key = (key ? key : 0);
				this.audioPlayerData.location = 'activeSession';
				this.audioPlayerData.type = type;
				this.audioPlayerData.selectedIndex = null;

				this.playerService.setData(this.audioPlayerData);
				item.playing = true;
			}
		}
	}

	// Replays +1
	updateReplays(id, user, playlist) {
		const data = {
			id: id,
			user: user,
			location: (this.audioPlayerData ? this.audioPlayerData.location : null),
			locationId: (this.audioPlayerData ? this.audioPlayerData.postId : null)
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
			/* album: this.audioPlayerData.username, */
			/* album: 'Playlist', */
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

				const dataS = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'session',
					id: item.id
				};

				this.audioDataService.addRemove(dataS)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
						text = !item.addRemoveSession ? (' ' + this.translations.common.hasBeenAdded) : (' ' + this.translations.common.hasBeenRemoved);
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
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

	// Show Player on Mobile
	showMobilePlayer(type) {
		// Add class
		this.document.getElementsByClassName('innerBodyUser')[1].classList.add('blur');

		// Config
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
			this.document.getElementsByClassName('innerBodyUser')[1].classList.remove('blur');
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

		// Close searchBox
		//this.search('close', null);
	}

	// Show panel from bottom on mobile
	showSessionPanelFromBottom() {
		this.showPlayer = false;

		// Add class
		this.document.getElementsByClassName('innerBodyUser')[1].classList.add('blur');

		// Config
		const config = {
			data: {
				sessionData: this.sessionData
			}
		};

		// Set sheet
		const bottomSheetRef = this.bottomSheet.open(ActiveSessionsMobileComponent, config);
		bottomSheetRef.afterDismissed().subscribe(val => {
			this.document.getElementsByClassName('innerBodyUser')[1].classList.remove('blur');
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
			this.changeTheme('user', data.theme);

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
			this.window.location.reload();
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
			const data = {
				type: 'language',
				language: lang.id
			}
			this.userDataService.updateData(data)
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
	changeTheme(type, value) {
		this.sessionData.current.theme = value;

		// Set theme
		if (value === 0) {
			this.document.body.classList.remove('darkTheme');
			this.document.getElementsByTagName('html')[0].setAttribute('class', 'light');
		} else if (value === 1) {
			this.document.body.classList.add('darkTheme');
			this.document.getElementsByTagName('html')[0].setAttribute('class', 'dark');
		} else {
			this.document.body.classList.add('darkTheme');
			this.document.getElementsByTagName('html')[0].setAttribute('class', 'dark');
		}

		// Close user box
		this.showChangeTheme = false;
		this.showUserBox = false;

		// Update on DB
		if (type === 'update') {
			const data = {
				type: 'theme',
				theme: value
			};

			this.userDataService.updateData(data).subscribe();
		}
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

	// Chat
	openChat(data) {
		this.location.go(this.router.url + '#sendChat');

		const config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				item: data,
				translations: this.translations
			}
		};

		const dialogRef = this.dialog.open(ShowChatComponent, config);
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
			this.sessionData.current.mp = true;
		} else if (type === 'expand') {
			this.audioPlayerData.mini = false;
			this.sessionData.current.mp = false;
		}

		// Set sessionData
		this.userDataService.setSessionData('data', this.sessionData);
		this.sessionService.setData(this.sessionData);

		// Update user
		const data = {
			type: 'miniPlayer',
			miniPlayer: this.audioPlayerData.mini ? 1 : 0
		};
		this.userDataService.updateData(data).subscribe();
	}

	// Login with Facebook | Google
	socialLogin(type, auth, element) {
		const self = this;

		if (type === 'facebook') {
			self.socialLoading = true;

			FB.login(res => {
              	if (res.authResponse) {
					FB.api('/me', 'get', { access_token: res.authResponse.accessToken, fields: 'id,name,email,picture' }, function(response) {
						let params = {
							type: type,
							email: response.email,
							password: null,
							id: response.id,
							name: response.name,
							avatar: ((response.picture ? (response.picture.data ? response.picture.data.url : null) : null) || null),
							lang: self.userDataService.getLang('get', null)
						};

						self.userDataService.login(params)
							.subscribe(
								res => {
									self.window.location.href = self.env.defaultPage;
									self.socialLoading = false;
								},
								error => {
									self.alertService.error(self.translations.common.anErrorHasOcurred);
									self.socialLoading = false;
								}
							);
					});
               	} else {
					self.alertService.error(self.translations.common.anErrorHasOcurred);
					self.socialLoading = false;
            	}
			});
		} else if (type === 'google') {
			auth.attachClickHandler(element, {},
				res => {
					let params = {
						type: type,
						email: res.getBasicProfile().getEmail(),
						password: null,
						id: res.getBasicProfile().getId(),
						name: res.getBasicProfile().getName(),
						avatar: (res.getBasicProfile().getImageUrl() || null),
						lang: self.userDataService.getLang('get', null)
					};

					self.socialLoading = true;
					self.userDataService.login(params)
						.subscribe(
							res => {
								self.window.location.href = self.env.defaultPage;
								self.socialLoading = false;
							},
							error => {
								self.alertService.error(self.translations.common.anErrorHasOcurred);
								self.socialLoading = false;
							}
						);
				}, error => {
					self.alertService.error(self.translations.common.anErrorHasOcurred);
					self.socialLoading = false;
				}
			);
		}
	}

	// Recommended on the right side
	getRecommendedUsersSongs() {
		// Users
		const dataU = {
			user: this.sessionData.current.id,
			cuantity: 3
		};
		this.userDataService.getRecommended(dataU)
			.subscribe((res: any) => {
				if (!res || res.length === 0) {
					this.recommendedUsers.list = [];
				} else {
					this.recommendedUsers.list = res;
				}
			}, error => {
				this.recommendedUsers.list = [];
			});

		//Songs
		const dataS = {
			user: this.sessionData.current.id,
			type: 'hits',
			cuantity: 3
		};
		this.audioDataService.general(dataS)
			.subscribe((res: any) => {
				if (!res || res.length === 0) {
					this.recommendedSongs.list = [];
				} else {
					this.recommendedSongs.list = res;
				}
			}, error => {
				this.recommendedSongs.list = [];
			});
	}

	// User options
	itemUserOptions(type, item, index) {
		switch (type) {
			case 'dismiss':
				item.dismiss = true;

				this.recommendedUsers.list.splice(index, 1);

				const data = {
					user: item.user.id
				};

				this.userDataService.dismissRecommended(data).subscribe();
				break;
			case 'report':
				item.type = 'user';
				this.sessionService.setDataReport(item);
				break;
		}
	}
}
