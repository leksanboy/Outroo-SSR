import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy, Inject, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Location, DOCUMENT } from '@angular/common';
import { trigger, transition, animate, style } from '@angular/animations'
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

import { ShowPlaylistComponent } from '../../../../app/pages/common/showPlaylist/showPlaylist.component';
import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var global: any;

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	providers: [TimeagoPipe, SafeHtmlPipe],
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
export class MainComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public swiperConfig: any = {
		pagination: '.swiper-pagination',
		nextButton: '.swiperNext',
		prevButton: '.swiperPrev',
		paginationClickable: true,
		spaceBetween: 0
	};
	public activeRouter: any;
	public activePlayerInformation: any;
	public activeLanguage: any;
	public activeNewPublication: any;
	public activeRouterExists: any;
	public activeSessionPlaylists: any;
	public activeComeFromUserButton: any;
	public activeGetData: any;
	public userExists = true;
	public data: any;
	public dataDefault: any;
	public searchBoxMentions: boolean;
	public comeFromUserButton: boolean;
	public showAccounts: boolean;
	public recommendedUsers = {
		loading: false,
		noData: true,
		show: false,
		list: []
	};
	public recommendedPlaylists = {
		loading: false,
		noData: true,
		show: false,
		list: []
	};

	constructor(
		@Inject(DOCUMENT) private document: Document,
		public dialog: MatDialog,
		private router: Router,
		private location: Location,
		private renderer: Renderer2,
		private elementRef: ElementRef,
		private alertService: AlertService,
		private playerService: PlayerService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private followsDataService: FollowsDataService,
		private publicationsDataService: PublicationsDataService,
		private metaService: MetaService,
		private ssrService: SsrService,
		private routingStateService: RoutingStateService,
	) {
		// Set component data
		this.activeRouter = this.router.events
			.subscribe(event => {
				if (event instanceof NavigationEnd) {
					// Session
					this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

					// User
					this.userData = this.activatedRoute.snapshot.data.userResolvedData;

					// Translations
					this.translations = this.activatedRoute.snapshot.data.langResolvedData;

					// Exit if no session
					this.userExists = this.userData ? true : false;

					// Meta
					const metaData = {
						page: this.userData.name,
						title: this.userData.name,
						description: this.userData.about,
						keywords: this.userData.about,
						url: this.env.url + this.userData.username,
						image: this.userData.avatarUrl
					};
					this.metaService.setData(metaData);

					// Close all dialogs
					this.dialog.closeAll();

					// Close notificationsBox
					this.sessionService.setNotificationsBox('close');

					// Run page on routing
					this.activeRouterExists = true;

					// Go top of page on change user
					if (this.ssrService.isBrowser) {
						this.window.scrollTo(0, 0);
					}

					// Update user data if im the user
					if (this.sessionData) {
						if (this.userData.id === this.sessionData.current.id) {
							this.sessionData = this.userDataService.setSessionData('update', this.userData);
						}
					}

					// Set Google analytics
					const url = this.userData.username;
					const title = this.userData.name;
					const userId = this.userData.id;
					this.userDataService.analytics(url, title, userId);

					// Data following/visitor
					const data = {
						receiver: this.userData.id
					};

					// Get publications
					this.default('default', this.userData.username);

					// Reset
					this.showAccounts = false;
					this.recommendedUsers.show = false;
				}
			});

		// Check button back
		this.activeComeFromUserButton = this.sessionService.getComeFromUserButton()
			.subscribe(data => {
				this.comeFromUserButton = data;
			});

		// Get sessions on logout
		this.activeGetData = this.sessionService.getData()
			.subscribe(data => {
				this.sessionData = data;
			});

		// Session playlists
		this.activeSessionPlaylists = this.sessionService.getDataPlaylists()
			.subscribe(data => {
				this.sessionData = data;
			});

		// Get current track
		this.activePlayerInformation = this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				this.getTranslations(data);
			});

		// Get new publication
		this.activeNewPublication = this.sessionService.getDataNewPublication()
			.subscribe(data => {
				this.newPublication('result', data.data);
			});

		// Click on a href
		this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
			if (event.target.localName === 'a') {
				this.sessionService.setDataClickElementRef(event);
			}
		});

		// Load more on scroll on bottom
		this.window.onscroll = (event) => {
			const windowHeight = 'innerHeight' in this.window ? this.window.innerHeight : document.documentElement.offsetHeight;
			const body = document.body, html = document.documentElement;
			const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			const windowBottom = windowHeight + this.window.pageYOffset;

			if (windowBottom >= docHeight) {
				if (this.dataDefault.list.length > 0) {
					this.default('more', null);
				}
			}
		};
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeSessionPlaylists.unsubscribe();
		this.activePlayerInformation.unsubscribe();
		this.activeLanguage.unsubscribe();
		this.activeNewPublication.unsubscribe();
		this.activeComeFromUserButton.unsubscribe();
		this.activeGetData.unsubscribe();

		this.showAccounts = false;
	}

	// Go back
	goBack() {
		this.routingStateService.getPreviousUrl();
	}

	// User options
	userOptions(type, item) {
		switch (type) {
			case 'copyLink':
				const urlExtension = this.env.url + item.username;
				this.sessionService.setDataCopy(urlExtension);
				break;
			case 'message':
				case 'user':
				item.comeFrom = 'shareUser';
				this.sessionService.setDataNewShare(item);
				break;
			case 'report':
				item.type = 'user';
				this.sessionService.setDataReport(item);
				break;
			case 'showAvatar':
				const dataSA = {
					userData: item
				};

				this.sessionService.setDataShowAvatar(dataSA);
				break;
			case 'openNewSession':
				this.showAccounts = false;

				const dataONS = {
					type: 'create'
				};

				this.sessionService.setDataAddAccount(dataONS);
				break;
			case 'setCurrentUser':
				this.showAccounts = false;

				const dataSCU = {
					type: 'set',
					data: item
				};

				this.sessionService.setDataAddAccount(dataSCU);
				break;
			case 'closeSession':
				this.showAccounts = false;

				const dataCS = {
					type: 'close',
					data: item
				};

				this.sessionService.setDataAddAccount(dataCS);
				break;
			case 'sendMessage':
				this.sessionService.setDataShowMessage(item);
				break;
		}
	}

	// Follow / Unfollow
	followUnfollow(type, item) {
		if (type === 'follow') {
			item.status = item.private ? 'pending' : 'following';
		} else if (type === 'unfollow') {
			item.status = 'unfollow';
		}

		const data = {
			type: item.status,
			private: item.private,
			receiver: item.user ? item.user.id : item.id
		};

		this.followsDataService.followUnfollow(data).subscribe();
	}

	// New publication
	newPublication(type, data) {
		if (type === 'new') {
			const opt = {
				type: 'new',
				data: null
			};

			this.sessionService.setDataNewPublication(opt);
		} else if (type === 'result') {
			if (data) {
				this.alertService.publishing(this.translations.main.publishing);

				setTimeout(() => {
					this.dataDefault.list.unshift(data);
					this.dataDefault.noData = false;
				}, 300);
			}
		}
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Default
	default(type, user) {
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

			this.recommendedUsers = {
				loading: false,
				noData: true,
				show: false,
				list: []
			};

			const data = {
				type: 'user',
				user: user,
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadingData = false;

					if (!res || res.length === 0) {
						this.dataDefault.noData = true;

						/* Show recommended user if no publications */
						setTimeout(() => {
							this.getRecommendedUsers();
						}, 1200);
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataDefault.noData = false;

						for (const i in res) {
							if (i) {
								res[i].contentLimit = this.env.contentLengthLimit;
								this.dataDefault.list.push(res[i]);
							}
						}
					}

					/* Show recommended playlists */
					setTimeout(() => {
						this.getRecommendedPlaylists();
					}, 300);

					if (!res || res.length < this.env.cuantity) {
						this.dataDefault.noMore = true;
					}
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			const data = {
				type: 'user',
				user: this.userData.id,
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
					this.dataDefault.loadingMoreData = false;

					// Push items
					if (!res || res.length > 0) {
						for (const i in res) {
							if (i) {
								this.dataDefault.list.push(res[i]);
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataDefault.noMore = true;
					}
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Item options
	itemPublicationOptions(type, item) {
		switch (type) {
			case 'show':
				this.location.go('/p/' + item.name);

				const config = {
					disableClose: false,
					data: {
						comeFrom: 'publication',
						translations: this.translations,
						sessionData: this.sessionData,
						userData: this.userData,
						item: item
					}
				};

				const dialogRef = this.dialog.open(ShowPublicationComponent, config);
				dialogRef.afterClosed().subscribe((res: any) => {
					this.location.go(this.router.url);

					if (res.user.id === this.sessionData.current.id) {
						item.addRemoveSession = res.addRemoveSession;
					}
				});
				break;
		}
	}

	// Recommended users
	getRecommendedUsers() {
		this.recommendedUsers.show = !this.recommendedUsers.show;
		this.recommendedUsers.loading = true;

		if (this.recommendedUsers.show && this.recommendedUsers.list.length === 0) {
			const data = {
				user: this.userData.id
			};

			this.userDataService.getRecommended(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.recommendedUsers.loading = false;
					}, 600);

					if (!res || res.length === 0) {
						this.recommendedUsers.noData = true;
					} else {
						this.recommendedUsers.noData = false;
						this.recommendedUsers.list = res;
					}
				}, error => {
					this.recommendedUsers.loading = false;
				});
		} else {
			this.recommendedUsers.loading = false;
		}
	}

	// Remove from shown list
	dismissRecommended(item, index) {
		item.dismiss = true;

		this.recommendedUsers.list.splice(index, 1);

		const data = {
			user: item.user.id
		};

		this.userDataService.dismissRecommended(data).subscribe();
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

	// Playlist options
	itemPlaylistOptions(type, item, index) {
		switch (type) {
			case ('show'):
				this.location.go('/pl/' + item.name);

				const configShow = {
					disableClose: false,
					data: {
						sessionData: this.sessionData,
						userData: this.userData,
						translations: this.translations,
						item: item,
						audioPlayerData: this.audioPlayerData
					}
				};

				const dialogRefShow = this.dialog.open(ShowPlaylistComponent, configShow);
				dialogRefShow.beforeClosed().subscribe((res: string) => {
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
}
