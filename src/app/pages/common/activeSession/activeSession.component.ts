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

import { NewPublicationComponent } from '../../../../app/pages/common/newPublication/newPublication.component';
import { NewPlaylistComponent } from '../../../../app/pages/common/newPlaylist/newPlaylist.component';
import { NewReportComponent } from '../../../../app/pages/common/newReport/newReport.component';
import { NewSessionComponent } from '../../../../app/pages/common/newSession/newSession.component';
import { ShowAvatarComponent } from '../../../../app/pages/common/showAvatar/showAvatar.component';
import { ShowMessageComponent } from '../../../../app/pages/common/showMessage/showMessage.component';
import { ShowLikesComponent } from '../../../../app/pages/common/showLikes/showLikes.component';
import { ShowMobilePlayerComponent } from '../../../../app/pages/common/showMobilePlayer/showMobilePlayer.component';
import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';
import { ShowSessionPanelMobileComponent } from '../../../../app/pages/common/showSessionPanelMobile/showSessionPanelMobile.component';
import { ShowShareComponent } from '../../../../app/pages/common/showShare/showShare.component';

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
	public sessionData: any = [];
	public translations: any = [];
	public dataNotifications: any = [];
	public navMenu: boolean;
	public deniedAccessOnlySession: boolean;
	public showPlayer: boolean;
	public showSessions: boolean;
	public showPlaylist: boolean;
	public showNotificationsBox: boolean;
	public showUserBox: boolean;
	public showCloseSession: boolean;
	public showChangeSession: boolean;
	public showChangeSessionOnMenu: boolean;
	public showChangeLanguage: boolean;
	public signingBox: boolean;
	public signOutCurrent: boolean;
	public audio: any;
	public audioPlayerData: any = {
		path: 'assets/media/audios/',
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
		list: []
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

		// Return home if no access
		if (!this.sessionData) {
			this.sessionData = [];
			this.sessionData.current = [];
			this.deniedAccessOnlySession = true;

			if (this.router.url === '/settings' || this.router.url === '/notifications' || this.router.url === '/news' || this.router.url === '/home') {
				this.userDataService.noSessionData();
				// console.log('No tengo session y no puedo acceder a settings, notifications, news, home');
			} else {
				// console.log('No tengo session pero puedo ver ciertas paginas :::> [', this.router.url, ']');
			}
		} else {
			// Add dark theme
			if (this.sessionData.current.theme) {
				this.document.body.classList.add('darkTheme');
			} else {
				this.document.body.classList.remove('darkTheme');
			}

			// Load default audios
			this.defaultAudios(this.sessionData.current.id);

			// Load default notifications
			this.defaultNotifications(this.sessionData.current.id);

			// Pending notifications
			this.pendingNotifications();

			// Pending notifications every 10 minutes
			setInterval(() => {
				this.pendingNotifications();
			}, 1000 * 60 * 10);

			// Get player data
			this.playerService.getData()
				.subscribe(data => {
					this.showPlaylist = true;
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

					// Get translations
					this.getTranslations(data.current.language);
				});

			// Get pending notifications
			this.sessionService.getPendingNotifications()
				.subscribe(data => {
					this.pendingNotifications();
				});

			// Get session playlists
			this.sessionService.getDataPlaylists()
				.subscribe(data => {
					this.sessionData = data;
				});

			// Get session create playlist
			this.sessionService.getDataCreatePlaylist()
				.subscribe(data => {
					this.itemSongOptions('createPlaylist', null, null);
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
					this.sessionData = data;
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
			this.sessionService.getDataShowShare()
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
				if (self.audioPlayerData.list[key].contentTypeAd) {
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
		console.log("setComeFromUserButton-->TRUE");

		setTimeout(() => {
			this.sessionService.setComeFromUserButton(true);
		}, 100);
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
					this.audioPlayerData.current.image = res[0].image ? (this.audioPlayerData.path + 'thumbnails/' + res[0].image) : '';

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
	pendingNotifications() {
		this.notificationsDataService.pending(this.sessionData.current.id)
			.subscribe(res => {
				this.sessionData.current.countPendingNotifications = res;

				// Get data to notifications box
				if (res > 0) {
					this.defaultNotifications(this.sessionData.current.id);
				}
			});
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
					for (const i of res) {
						if (i) {
							setTimeout(() => {
								i.status = 1;
							}, 1800);
						}
					}

					this.dataNotifications.list = res;
				}
			}, error => {
				this.dataNotifications.loadingData = false;
				this.dataNotifications.noMore = true;
			});
	}

	// Show notifications web
	showNotificationsBoxWeb() {
		this.showNotificationsBox = !this.showNotificationsBox;

		// Count to '0'
		this.sessionData.current.countPendingNotifications = 0;
	}

	// Show photo from url if is one
	showNotification(item) {
		if (item.url === 'publications') {
			const data = {
				name: item.contentData.name,
				session: this.sessionData.current.id
			};

			this.publicationsDataService.getPost(data)
				.subscribe((res: any) => {
					this.location.go(this.router.url + '#publication');

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
					this.audioPlayerData.playing = true;
					this.audioPlayerData.current.user = this.audioPlayerData.user;
					this.audioPlayerData.current.type = this.audioPlayerData.type;
					this.audioPlayerData.current.key = key;
					this.audioPlayerData.current.item = this.audioPlayerData.list[key];
					this.audioPlayerData.current.original_artist = this.audioPlayerData.list[key].original_artist ? this.audioPlayerData.list[key].original_artist : this.audioPlayerData.list[key].title;
					this.audioPlayerData.current.original_title = this.audioPlayerData.list[key].original_title ? this.audioPlayerData.list[key].original_title : this.audioPlayerData.list[key].title;
					this.audioPlayerData.current.duration = this.audioPlayerData.list[key].duration;
					this.audioPlayerData.current.image = this.audioPlayerData.list[key].image ? (this.audioPlayerData.path + 'thumbnails/' + this.audioPlayerData.list[key].image) : '';
					this.audio.src = this.audioPlayerData.path + this.audioPlayerData.list[key].name;
					this.audio.load();
					this.getColorFromAudioCover(this.audioPlayerData.current.image);

					// Replays +1
					this.updateReplays(this.audioPlayerData.list[key].song, this.sessionData.current.id);

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
				if (this.audioPlayerData.list[prevKey].contentTypeAd) {
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
				if (this.audioPlayerData.list[nextKey].contentTypeAd) {
					// Check if last element of the list is ad
					if (this.audioPlayerData.list[this.audioPlayerData.list.length - 1].contentTypeAd) {
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

	// Replays +1
	updateReplays(id, user) {
		const data = {
			id: id,
			user: user
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
			artwork: [
				{
					src: this.audioPlayerData.current.image
				}
			]
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
		const time = ((event.value / 1000) * this.audio.duration);
		this.audio.currentTime = time;
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
			case('createPlaylist'):
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
						this.sessionData.current.playlists.unshift(res);
						this.sessionData = this.userDataService.setSessionData('update', this.sessionData.current);
						this.sessionService.setDataPlaylists(this.sessionData);
						this.alertService.success(this.translations.common.createdSuccessfully);
					}
				});
			break;
			case('report'):
				item.type = 'audio';
				this.sessionService.setDataReport(item);
			break;
		}
	}

	// Share on social media
	shareOn(type, item) {
		switch (type) {
			case 'message':
				item.comeFrom = 'shareSong';
				this.sessionService.setDataShowShare(item);
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

	// Get color
	getColorFromAudioCover(image) {
		const self = this;

		if (image) {
			const img = this.document.createElement('img');
			img.setAttribute('src', image);
			const vibrant = new Vibrant(img);
			const swatches = vibrant.swatches();

			for (const i in swatches) {
				if (i) {
					if (swatches.hasOwnProperty(i) && swatches[i]) {
						if (i === 'Vibrant') {
							self.audioPlayerData.current.color = swatches[i].getHex();
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
		const bottomSheetRef = this.bottomSheet.open(ShowMobilePlayerComponent, config);
		bottomSheetRef.afterDismissed().subscribe(val => {
			// no actions
		});
	}

	// Show playlist web
	showPlaylistWeb() {
		this.showUserBox = false;
		this.showPlaylist = !this.showPlaylist;
	}

	// Show userBox web
	showUserBoxWeb() {
		this.showUserBox = !this.showUserBox;
		this.showCloseSession = false;
		this.showChangeSession = false;
		this.showChangeLanguage = false;
		this.showPlaylist = false;
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
		const bottomSheetRef = this.bottomSheet.open(ShowSessionPanelMobileComponent, config);
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
			// Dark/White theme
			if (data.theme) {
				this.document.body.classList.add('darkTheme');
			} else {
				this.document.body.classList.remove('darkTheme');
			}

			// Get translations
			this.getTranslations(data.language);

			// Get pending notifications
			this.notificationsDataService.pending(data.id)
				.subscribe(res => {
					data.countPendingNotifications = res;
				});

			// Set data
			this.sessionData.current = data;
			this.sessionService.setData(this.sessionData);

			// Session set
			this.sessionData = this.userDataService.setSessionData('data', this.sessionData);
			this.showSessions = false;
			this.showChangeSessionOnMenu = false;
			this.showChangeSession = false;
			this.showUserBox = false;

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
			this.document.body.classList.remove('darkTheme');
			this.userDataService.logout();
			this.playPlayer('stop', null);
			this.router.navigate(['logout']);
		} else {
			for (const i in this.sessionData.sessions) {
				if (i) {
					if (this.sessionData.sessions[i].id === data.id) {
						this.sessionData.sessions.splice(i, 1);
					}
				}
			}

			// Set different account and check if is not set and deleted
			this.setCurrentUser(this.sessionData.sessions[0]);
		}
	}

	// Dark theme
	changeTheme() {
		this.sessionData.current.theme = !this.sessionData.current.theme;

		if (this.sessionData.current.theme) {
			this.document.body.classList.add('darkTheme');
		} else {
			this.document.body.classList.remove('darkTheme');
		}

		const data = {
			id: this.sessionData.current.id,
			theme: this.sessionData.current.theme
		};

		this.userDataService.updateTheme(data)
			.subscribe(res => {
				setTimeout(() => {
					this.sessionData = this.userDataService.getSessionData();
					this.sessionService.setDataTheme(this.sessionData);

					if (this.sessionData.current.theme) {
						this.alertService.success(this.translations.common.darkThemeEnabled);
					} else {
						this.alertService.success(this.translations.common.darkThemeDisabled);
					}
				}, 1000);
			}, error => {
				this.alertService.error(this.translations.common.anErrorHasOcurred);
			});
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

			const dialogRef = this.dialog.open(ShowShareComponent, config);
			dialogRef.afterClosed().subscribe((res: any) => {
				// Check if is new chat with content or last insered comment
				if (res.close) {
					this.sessionService.setDataShowShare(res);
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
}
