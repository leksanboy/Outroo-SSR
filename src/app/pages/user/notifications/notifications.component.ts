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

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';
import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';

declare var global: any;

// - Una vez logado que no entre en signup/confirmEmail/recoverPassowrd/etc...
// - Ha compartido una playlist desde canciones
// - Te ha enviado un mensaje

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public dataNotifications: any = [];
	public dataChats: any = [];
	public data: any = {
		selectedIndex: 0
	};
	public activeShare: any;
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
		private audioDataService: AudioDataService,
		private followsDataService: FollowsDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService,
		private ssrService: SsrService,
		private routingStateService: RoutingStateService,
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Data
		if (this.sessionData) {
			// Set title
			this.titleService.setTitle(this.translations.notifications.title);

			// Set Google analytics
			const url = '[' + this.sessionData.current.id + ']/notifications';
			this.userDataService.analytics(url);

			// Load default
			this.default('default');
		} else {
			this.userDataService.noSessionData();
		}

		// Get Share
		this.activeShare = this.sessionService.getDataShowShare()
			.subscribe(data => {
				// Check if is new chat with content
				if (data.close) {
					if (data.new && data.list.length > 0) {
						this.dataChats.list.unshift(data);
					} else if (data.list.length > 0) {
						for (const i in this.dataChats.list) {
							if (this.dataChats.list[i].id === data.item.id) {
								this.dataChats.list[i].last = data.last;
							}
						}
					}
				}
			});

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
				if (this.dataNotifications.list.length > 0) {
					this.default('more');
				}
			}
		};
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeShare.unsubscribe();
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
			this.dataNotifications = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noData: false,
				noMore: false
			};

			const data = {
				type: 'default',
				rows: this.dataNotifications.rows,
				cuantity: this.env.cuantity
			};

			this.notificationsDataService.default(data)
				.subscribe((res: any) => {
					this.dataNotifications.loadingData = false;

					if (!res || res.length === 0) {
						this.dataNotifications.noData = true;
					} else {
						this.dataNotifications.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

						for (const i in res) {
							if (i) {
								setTimeout(() => {
									res[i].status = 1;
								}, 1800);
							}
						}

						this.dataNotifications.list = res;
						this.sessionService.setPendingNotifications('refresh');
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataNotifications.noMore = true;
					}
				}, error => {
					this.dataNotifications.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataNotifications.noMore && !this.dataNotifications.loadingMoreData) {
			this.dataNotifications.loadingMoreData = true;
			this.dataNotifications.rows++;

			const data = {
				rows: this.dataNotifications.rows,
				cuantity: this.env.cuantity
			};

			this.notificationsDataService.default(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataNotifications.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataNotifications.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0) {
							for (const i in res) {
								if (res[i]) {
									setTimeout(() => {
										res[i].status = 1;
									}, 1800);

									this.dataNotifications.list.push(res[i]);
								}
							}
						}

						this.sessionService.setPendingNotifications('refresh');

						if (!res || res.length < this.env.cuantity) {
							this.dataNotifications.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataNotifications.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Follow / Unfollow
	followUnfollow(type, item) {
		if (type === 'accept') {
			// When other send you a request
			item.type = 'startFollowing';
			item.statusF = 'accept';

			const data = {
				type: item.statusF,
				private: item.private,
				sender: item.user.id
			};

			// Check following status
			this.followsDataService.followUnfollow(data)
				.subscribe((res: any) => {
					item.statusFollowing = res;
				});
		} else if (type === 'decline') {
			// When other send you a request
			item.type = 'startFollowing';
			item.statusFollowing = 'declined';
			item.statusF = 'decline';

			const data = {
				type: item.statusF,
				private: item.private,
				sender: item.user.id
			};

			this.followsDataService.followUnfollow(data).subscribe();
		} else if (type === 'follow') {
			// When you start following someone who follow you
			item.statusFollowing = item.private ? 'pending' : 'following';

			const data = {
				type: item.statusFollowing,
				private: item.private,
				receiver: item.user.id
			};

			this.followsDataService.followUnfollow(data).subscribe();
		} else if (type === 'unfollow') {
			// Stop following
			item.statusFollowing = 'unfollow';

			const data = {
				type: item.statusFollowing,
				private: item.private,
				receiver: item.user.id
			};

			this.followsDataService.followUnfollow(data).subscribe();
		}
	}

	// Show photo from url if is one
	show(item) {
		if (item.url === 'photos') {
			this.sessionService.setDataShowPhoto(item);
		} else if (item.url === 'publications') {
			this.sessionService.setDataShowPublication(item);
		} else if (item.url === 'message') {
			this.sessionService.setDataShowMessage(item.user);
		}
	}

	// Item options
	itemOptions(type, item) {
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

	// Play song
	playSong(data, item, key, type) {
		if (!this.sessionData.current.id) {
			this.alertService.success(this.translations.common.createAnAccountToListenSong);
		} else {
			if (this.audioPlayerData.key === key &&
				this.audioPlayerData.type === type &&
				this.audioPlayerData.item.song === item.song
			) { // Play/Pause current
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
		switch (type) {
			case('addRemoveUser'):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				const dataARO = {
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.id
				};

				this.audioDataService.addRemove(dataARO)
					.subscribe(res => {
						item.insertedId = res;
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case('playlist'):
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
						text = ' ' + this.translations.common.hasBeenAddedTo + ' ' + playlist.title;
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
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
}
