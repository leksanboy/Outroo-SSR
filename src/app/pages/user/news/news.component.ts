import { Title, DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Location, DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';

import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var global: any;

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	providers: [ SafeHtmlPipe ]
})
export class NewsComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public dataDefault: any = [];
	public dataHashtag: any = [];
	public dataSearch: any = [];
	public dataPeople: any = [];
	public dataPosts: any = [];
	public dataTop: any = [];
	public dataTags: any = [];
	public data: any = {
		selectedIndex: 0,
		active: 'default',
		selectedHashtag: null
	};
	public dataSongs: any = [];
	public audioPlayerData: any = [];
	public activePlayerInformation: any;
	public activeLanguage: any;
	public activeSessionPlaylists: any;
	public hideAd: boolean;
	public actionFormSearch: FormGroup;

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
		private publicationsDataService: PublicationsDataService,
		private followsDataService: FollowsDataService,
		private ssrService: SsrService,
		private routingStateService: RoutingStateService,
		private audioDataService: AudioDataService,
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Search
		this.actionFormSearch = this._fb.group({
			caption: ['']
		});

		// Data
		if (this.sessionData) {
			// Set Google analytics
			const url = 'news';
			const title = this.translations.news.title;
			const userId = this.sessionData.current.id;
			this.userDataService.analytics(url, title, userId);

			// Set title
			this.titleService.setTitle(title);

			// Redirected hashtag
			const urlData: any = this.activatedRoute.snapshot;

			if (urlData.params.name) {
				this.data.newSearchCaption = urlData.params.name;

				if (urlData.params.type === 'people') {
					this.data.selectedIndex = 1;
				} else {
					this.data.selectedIndex = 0;
				}

				this.search('default');
				this.actionFormSearch.get('caption').setValue(urlData.params.name);
			} else {
				// Load default
				const localStotageData = this.userDataService.getLocalStotage('newsPage');
				if (localStotageData) {
					this.dataDefault = localStotageData;
				} else {
					this.default('default', this.sessionData.current.username);
				}
			}
		} else {
			this.userDataService.noSessionData();
		}

		// Session playlists
		this.activeSessionPlaylists = this.sessionService.getDataPlaylists()
			.subscribe(data => {
				this.sessionData = data;
			});

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				this.getTranslations(data);
			});

		// Get current track
		this.activePlayerInformation = this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});

		// Load more on scroll on bottom
		this.window.onscroll = (event) => {
			const windowHeight = 'innerHeight' in this.window ? this.window.innerHeight : document.documentElement.offsetHeight;
			const body = document.body, html = document.documentElement;
			const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			const windowBottom = windowHeight + this.window.pageYOffset;

			if (windowBottom >= docHeight) {
				if (this.data.active === 'default') {
					if (this.dataDefault.list.length > 0) {
						this.default('more', this.sessionData.current.username);
					}
				} else if (this.data.active === 'search') {
					switch (this.data.selectedIndex) {
						case 0:
							if (this.dataTop.list.length > 0) {
								this.top('more');
							}
							break;
						case 1:
							if (this.dataPeople.list.length > 0) {
								this.people('more');
							}
							break;
						case 2:
							if (this.dataSongs.list.length > 0) {
								this.songs('more');
							}
							break;
						case 3:
							if (this.dataPosts.list.length > 0) {
								this.posts('more');
							}
							break;
						case 4:
							if (this.dataTags.list.length > 0) {
								this.tags('more');
							}
							break;
					}
				}
			}
		};
	}

	ngOnInit() {
		// Search/Reset
		this.actionFormSearch.controls['caption'].valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged())
			.subscribe(val => {
				this.data.newSearchCaption = val.replace( /#/g, '');
				(val.trim().length > 0) ? this.search('default') : this.search('clear');
			});
	}

	ngOnDestroy() {
		this.activeSessionPlaylists.unsubscribe();
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
				this.titleService.setTitle(this.translations.news.title);
			});
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
						userData: this.sessionData.current,
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

	// Set tab on click
	setTab(tab) {
		switch (tab) {
			case 0:
				if (!this.dataTop.list || (this.dataTop.searchCaption !== this.data.newSearchCaption)) {
					this.top('default');
				}
				break;
			case 1:
				if (!this.dataPeople.list || (this.dataPeople.searchCaption !== this.data.newSearchCaption)) {
					this.people('default');
				}
				break;
			case 2:
				if (!this.dataSongs.list || (this.dataSongs.searchCaption !== this.data.newSearchCaption)) {
					this.songs('default');
				}
				break;
			case 3:
				if (!this.dataPosts.list || (this.dataPosts.searchCaption !== this.data.newSearchCaption)) {
					this.posts('default');
				}
				break;
			case 4:
				if (!this.dataTags.list || (this.dataTags.searchCaption !== this.data.newSearchCaption)) {
					this.tags('default');
				}
				break;
		}
	}

	// Search
	search(type) {
		if (type === 'default') {
			this.data.active = 'search';

			// Current tab
			switch (this.data.selectedIndex) {
				case 0:
					this.top('default');
					break;
				case 1:
					this.people('default');
					break;
				case 2:
					this.songs('default');
					break;
				case 3:
					this.posts('default');
					break;
				case 4:
					this.tags('default');
					break;
			}
		} else if (type === 'clear') {
			this.data.active = 'default';
			this.data.selectedIndex = 0;
			this.actionFormSearch.get('caption').setValue('');
			this.location.go('/news');

			if (this.dataDefault.length === 0) {
				this.default('default', this.sessionData.current.username);
			}
		}
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

			const data = {
				type: 'news',
				user: user,
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity + 1
			};

			this.publicationsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadingData = false;

					if (!res || res.length === 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

						for (const i in res) {
							if (i) {
								if (i == '4' || i == '8' || // +4 (+9)
									i == '17' || i == '21' || i == '27' || // +4 +6 (+7)
									i == '34' || i == '40' || i == '44' || // +6 +4 (+9)
									i == '53' || i == '57' || i == '63' || // +4 +6 (+7)
									i == '70' || i == '76' || i == '80' || i == '89') { // +6 +4 +9  +LM
									res[i].big = true;
								}

								this.dataDefault.list.push(res[i]);

								// Push add
								if (i === '12' || i === '30' || i === '48' || i === '66' || i === '84') {
									this.dataDefault.list.push(this.pushAd());
								}
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataDefault.noMore = true;
					}

					this.userDataService.setLocalStotage('newsPage', this.dataDefault);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			const data = {
				type: 'news',
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity + 1
			};

			this.publicationsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
					this.dataDefault.loadingMoreData = false;

					if (!res || res.length > 0) {
						for (const i in res) {
							if (i) {
								if (i == '4' || i == '8' || // +4 (+9)
									i == '17' || i == '21' || i == '27' || // +4 +6 (+7)
									i == '34' || i == '40' || i == '44' || // +6 +4 (+9)
									i == '53' || i == '57' || i == '63' || // +4 +6 (+7)
									i == '70' || i == '76' || i == '80' || i == '89') { // +6 +4 +9 +LM
									res[i].big = true;
								}

								this.dataDefault.list.push(res[i]);

								// Push add
								if (i === '12' || i === '30' || i === '48' || i === '66' || i === '84') {
									this.dataDefault.list.push(this.pushAd());
								}
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataDefault.noMore = true;
					}

					this.userDataService.setLocalStotage('newsPage', this.dataDefault);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Top
	top(type) {
		if (type === 'default') {
			this.dataTop = {
				list: [],
				rows: 0,
				loadingData: true,
				noData: false,
				searchCaption: this.data.newSearchCaption
			};

			const data = {
				caption: this.dataTop.searchCaption,
				rows: this.dataTop.rows,
				cuantity: this.env.cuantity / 3
			};

			this.publicationsDataService.searchTop(data)
				.subscribe((res: any) => {
					this.dataTop.loadingData = false;

					if (!res || res.length === 0) {
						this.dataTop.noData = true;
					} else {
						this.dataTop.list = res;
					}
				}, error => {
					this.dataTop.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// People
	people(type) {
		if (type === 'default') {
			this.dataPeople = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false,
				searchCaption: this.data.newSearchCaption
			};

			const data = {
				caption: this.dataPeople.searchCaption,
				rows: this.dataPeople.rows,
				cuantity: this.env.cuantity
			};

			this.followsDataService.search(data)
				.subscribe((res: any) => {
					this.dataPeople.loadingData = false;

					if (!res || res.length === 0) {
						this.dataPeople.noData = true;
					} else {
						this.dataPeople.loadMoreData = (res.length < this.env.cuantity) ? false : true;
						this.dataPeople.list = res;
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataPeople.noMore = true;
					}
				}, error => {
					this.dataPeople.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataPeople.noMore && !this.dataPeople.loadingMoreData) {
			this.dataPeople.loadingMoreData = true;
			this.dataPeople.rows++;

			const data = {
				caption: this.dataPeople.searchCaption,
				rows: this.dataPeople.rows,
				cuantity: this.env.cuantity
			};

			this.followsDataService.search(data)
				.subscribe((res: any) => {
					this.dataPeople.loadMoreData = (res.length < this.env.cuantity) ? false : true;
					this.dataPeople.loadingMoreData = false;

					if (!res || res.length > 0) {
						for (const i in res) {
							if (i) {
								this.dataPeople.list.push(res[i]);
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataPeople.noMore = true;
					}
				}, error => {
					this.dataPeople.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Posts
	posts(type) {
		if (type === 'default') {
			this.dataPosts = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false,
				searchCaption: this.data.newSearchCaption
			};

			const data = {
				caption: this.dataPosts.searchCaption,
				rows: this.dataPosts.rows,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.search(data)
				.subscribe((res: any) => {
					this.dataPosts.loadingData = false;

					if (!res || res.length === 0) {
						this.dataPosts.noData = true;
					} else {
						this.dataPosts.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

						for (const i in res) {
							if (i) {
								this.dataPosts.list.push(res[i]);

								// Push add
								if (i === '11' || i === '23' || i === '35' || i === '47' || i === '59' || i === '71' || i === '83') {
									this.dataPosts.list.push(this.pushAd());
								}
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataPosts.noMore = true;
					}
				}, error => {
					this.dataPosts.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataPosts.noMore && !this.dataPosts.loadingMoreData) {
			this.dataPosts.loadingMoreData = true;
			this.dataPosts.rows++;

			const data = {
				caption: this.dataPosts.searchCaption,
				rows: this.dataPosts.rows,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.search(data)
				.subscribe((res: any) => {
					this.dataPosts.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
					this.dataPosts.loadingMoreData = false;

					if (!res || res.length > 0) {
						for (const i in res) {
							if (i) {
								this.dataPosts.list.push(res[i]);

								// Push add
								if (i === '15' || i === '30' || i === '45' || i === '60') {
									this.dataPosts.list.push(this.pushAd());
								}
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataPosts.noMore = true;
					}
				}, error => {
					this.dataPosts.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Tag
	tags(type) {
		if (type === 'default') {
			this.dataTags = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false,
				searchCaption: this.data.newSearchCaption
			};

			const data = {
				caption: this.dataTags.searchCaption,
				rows: this.dataTags.rows,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.searchTag(data)
				.subscribe((res: any) => {
					this.dataTags.loadingData = false;

					if (!res || res.length === 0) {
						this.dataTags.noData = true;
					} else {
						this.dataTags.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

						for (const i in res) {
							if (i) {
								this.dataTags.list.push(res[i]);
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataTags.noMore = true;
					}
				}, error => {
					this.dataTags.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataTags.noMore && !this.dataTags.loadingMoreData) {
			this.dataTags.loadingMoreData = true;
			this.dataTags.rows++;

			const data = {
				caption: this.dataTags.searchCaption,
				rows: this.dataTags.rows,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.searchTag(data)
				.subscribe((res: any) => {
					this.dataTags.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
					this.dataTags.loadingMoreData = false;

					if (!res || res.length > 0) {
						for (const i in res) {
							// Push items
							if (res[i]) {
								this.dataTags.list.push(res[i]);
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataTags.noMore = true;
					}
				}, error => {
					this.dataTags.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Set hashtag
	getHashtag(type, item) {
		if (type === 'set') {
			if (this.ssrService.isBrowser) {
				this.window.scrollTo(0, 0);
			}
			this.data.active = 'hashtag';
			this.data.selectedHashtag = item.caption;
			this.getHashtag('default', item);
		} else if (type === 'close') {
			this.data.active = 'search';
		} else if (type === 'default') {
			this.dataHashtag = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false,
				searchCaption: item.caption.replace( /#/g, '')
			};

			const data = {
				caption: this.dataHashtag.searchCaption,
				rows: this.dataHashtag.rows,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.search(data)
				.subscribe((res: any) => {
					this.dataHashtag.loadingData = false;

					if (!res || res.length === 0) {
						this.dataHashtag.noData = true;
					} else {
						this.dataHashtag.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

						for (const i in res) {
							if (i) {
								this.dataHashtag.list.push(res[i]);

								// Push add
								if (i === '10' || i === '20' || i === '30' || i === '40') {
									this.dataHashtag.list.push(this.pushAd());
								}
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataHashtag.noMore = true;
					}
				}, error => {
					this.dataHashtag.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataHashtag.noMore && !this.dataHashtag.loadingMoreData) {
			this.dataHashtag.loadingMoreData = true;
			this.dataHashtag.rows++;

			const data = {
				caption: this.dataHashtag.searchCaption,
				rows: this.dataHashtag.rows,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.search(data)
				.subscribe((res: any) => {
					this.dataHashtag.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
					this.dataHashtag.loadingMoreData = false;

					if (!res || res.length > 0) {
						for (const i in res) {
							if (i) {
								this.dataHashtag.list.push(res[i]);

								// Push add
								if (i === '15' || i === '30' || i === '45' || i === '60') {
									this.dataHashtag.list.push(this.pushAd());
								}
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataHashtag.noMore = true;
					}
				}, error => {
					this.dataHashtag.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Songs
	songs(type) {
		if (type === 'default') {
			this.dataSongs = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			};

			const data = {
				type: 'song',
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSongs.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.search(data)
				.subscribe((res: any) => {
					this.dataSongs.loadingData = false;

					if (!res || res.length === 0) {
						this.dataSongs.noData = true;
					} else {
						this.dataSongs.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

						for (const i in res) {
							if (i) {
								this.dataSongs.list.push(res[i]);

								// Push ad
								if (i === (Math.round(res.length / 5)).toString()) {
									this.dataSongs.list.push(this.pushAd());
								}
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataSongs.noMore = true;
					}
				}, error => {
					this.dataSongs.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
			} else if (type === 'more' && !this.dataPosts.noMore && !this.dataPosts.loadingMoreData) {
				this.dataSongs.loadingMoreData = true;
				this.dataSongs.rows++;

				const data = {
					type: 'song',
					caption: this.actionFormSearch.get('caption').value,
					rows: this.dataSongs.rows,
					cuantity: this.env.cuantity
				};

				this.audioDataService.search(data)
					.subscribe((res: any) => {
						this.dataSongs.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataSongs.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (const i in res) {
								if (i) {
									this.dataSongs.list.push(res[i]);

									// Push ad
									if (i === '19') {
										this.dataSongs.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataSongs.noMore = true;
						}
					}, error => {
						this.dataSongs.loadingData = false;
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
		}
	}

	// Play item song
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
			/* this.audioPlayerData.user = this.userData.id;
			this.audioPlayerData.username = this.userData.username; */
			this.audioPlayerData.location = 'audios';
			this.audioPlayerData.type = type;
			this.audioPlayerData.selectedIndex = this.data.selectedIndex;

			this.playerService.setData(this.audioPlayerData);
			item.playing = true;
		}
	}

	// Item options
	itemSongOptions(type, item, playlist) {
		switch (type) {
			case ('addRemoveSession'):
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				const dataARS = {
					type: item.removeType,
					location: 'session',
					id: item.id
				};

				this.audioDataService.addRemove(dataARS)
					.subscribe(res => {
						// let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
						// 	text = !item.addRemoveSession ? (' ' + this.translations.common.hasBeenAdded) : (' ' + this.translations.common.hasBeenRemoved);
						// this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case ('addRemoveUser'):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				const dataARO = {
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.song
				};

				this.audioDataService.addRemove(dataARO)
					.subscribe(res => {
						item.insertedId = res;
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
							text = ' ' + this.translations.common.hasBeenAddedTo + ' ' + playlist.title;

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
}
