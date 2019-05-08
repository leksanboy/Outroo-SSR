import { DOCUMENT, DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var global: any;

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	providers: [ SafeHtmlPipe ]
})
export class NewsComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public dataDefault: any = [];
	public dataHashtag: any = [];
	public dataSearch: any = [];
	public dataPeople: any = [];
	public dataPosts: any = [];
	public dataTop: any = [];
	public dataTag: any = [];
	public data: any = {
		selectedIndex: 0,
		active: 'default',
		selectedHashtag: null
	};
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
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private publicationsDataService: PublicationsDataService,
		private followsDataService: FollowsDataService,
		private ssrService: SsrService
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Data
		if (this.sessionData) {
			// Set title
			this.titleService.setTitle(this.translations.settings.title);

			// Set Google analytics
			let url = '[' + this.sessionData.current.id + ']/news';
			this.userDataService.analytics(url);

			// Load default
			this.default('default');

			// Redirected hashtag
			let urlData: any = this.activatedRoute.snapshot;
			if (urlData.params.name) {
				this.data.newSearchCaption = urlData.params.name;
				this.data.selectedIndex = 2;
				this.search('default');
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
				if (this.data.active == 'default') {
					if (this.dataDefault.list.length > 0)
						this.default('more');

				} else if (this.data.active == 'search') {
					switch (this.data.selectedIndex) {
						case 0:
							if (this.dataTop.list.length > 0)
								this.top('more');
							break;
						case 1:
							if (this.dataPeople.list.length > 0)
								this.people('more');
							break;
						case 2:
							if (this.dataPosts.list.length > 0)
								this.posts('more');
							break;
						case 3:
							if (this.dataTag.list.length > 0)
								this.tag('more');
							break;
					}
				}
			}
		}
	}

	ngOnInit() {
		// Search
		this.actionFormSearch = this._fb.group({
			caption: ['']
		});

		// Search/Reset
		this.actionFormSearch.controls["caption"].valueChanges
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

	// Push Google Ad
	pushAd(){
		let ad = this.environment.ad;

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
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
				this.titleService.setTitle(this.translations.news.title);
			});
	}

	// Show publication
	show(item) {
		let data = {
			name: item.name
		}

		this.publicationsDataService.getPost(data)
			.subscribe((res: any) => {
				this.location.go(this.router.url + '#publication');

				let config = {
					disableClose: false,
					data: {
						comeFrom: 'publications',
						translations: this.translations,
						sessionData: this.sessionData,
						userData: (res ? res.user : null),
						item: (res ? res : null)
					}
				};

				// Open dialog
				let dialogRef = this.dialog.open(ShowPublicationComponent, config);
				dialogRef.afterClosed().subscribe((result: any) => {
					this.location.go(this.router.url);
				});
			});
	}

	// Set tab on click
	setTab(tab){
		switch (tab) {
			case 0:
				if (!this.dataTop.list || (this.dataTop.searchCaption != this.data.newSearchCaption))
					this.top('default');
				break;
			case 1:
				if (!this.dataPeople.list || (this.dataPeople.searchCaption != this.data.newSearchCaption))
					this.people('default');
				break;
			case 2:
				if (!this.dataPosts.list || (this.dataPosts.searchCaption != this.data.newSearchCaption))
					this.posts('default');
				break;
			case 3:
				if (!this.dataTag.list || (this.dataTag.searchCaption != this.data.newSearchCaption))
					this.tag('default');
				break;
		}
	}

	// Search
	search(type){
		if (type == 'default') {
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
					this.posts('default');
					break;
				case 3:
					this.tag('default');
					break;
			}
		} else if (type == 'clear') {
			this.data.active = 'default';
			this.data.selectedIndex = 0;
			this.actionFormSearch.get('caption').setValue('');
		}
	}

	// Default
	default(type) {
		if (type == 'default') {
			this.dataDefault = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noData: false,
				noMore: false
			}

			let data = {
				type: 'news',
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity*3
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (!res || res.length == 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity*3) ? false : true;

						for (let i in res) {
							// Push items
							this.dataDefault.list.push(res[i]);

							// Push add
							if (i == '10' || i == '20' || i == '30' || i == '40')
								this.dataDefault.list.push(this.pushAd());
						}
					}

					if (!res || res.length < this.environment.cuantity*3)
						this.dataDefault.noMore = true;
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				type: 'news',
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity*3
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity*3) ? false : true;
						this.dataDefault.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (let i in res){
								// Push items
								this.dataDefault.list.push(res[i]);

								// Push add
								if (i == '15' || i == '30' || i == '45' || i == '60')
									this.dataDefault.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity*3)
							this.dataDefault.noMore = true;
					}, 600);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Top
	top(type){
		if (type == 'default') {
			this.dataTop = {
				list: [],
				rows: 0,
				loadingData: true,
				noData: false,
				searchCaption: this.data.newSearchCaption
			}

			let data = {
				caption: this.dataTop.searchCaption,
				rows: this.dataTop.rows,
				cuantity: environment.cuantity/3
			}

			this.publicationsDataService.searchTop(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataTop.loadingData = false;

						if (!res || res.length == 0)
							this.dataTop.noData = true;
						else
							this.dataTop.list = res;
					}, 600);
				}, error => {
					this.dataTop.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// People
	people(type){
		if (type == 'default') {
			this.dataPeople = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false,
				searchCaption: this.data.newSearchCaption
			}

			let data = {
				caption: this.dataPeople.searchCaption,
				rows: this.dataPeople.rows,
				cuantity: environment.cuantity
			}

			this.followsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataPeople.loadingData = false;

						if (!res || res.length == 0) {
							this.dataPeople.noData = true;
						} else {
							this.dataPeople.loadMoreData = (res.length < environment.cuantity) ? false : true;
							this.dataPeople.list = res;
						}

						if (!res || res.length < environment.cuantity)
							this.dataPeople.noMore = true;
					}, 600);
				}, error => {
					this.dataPeople.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataPeople.noMore && !this.dataPeople.loadingMoreData) {
			this.dataPeople.loadingMoreData = true;
			this.dataPeople.rows++;

			let data = {
				caption: this.dataPeople.searchCaption,
				rows: this.dataPeople.rows,
				cuantity: environment.cuantity
			}

			this.followsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataPeople.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataPeople.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								this.dataPeople.list.push(res[i]);

						if (!res || res.length < environment.cuantity)
							this.dataPeople.noMore = true;
					}, 600);
				}, error => {
					this.dataPeople.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Posts
	posts(type){
		if (type == 'default') {
			this.dataPosts = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false,
				searchCaption: this.data.newSearchCaption
			}

			let data = {
				caption: this.dataPosts.searchCaption,
				rows: this.dataPosts.rows,
				cuantity: this.environment.cuantity*3
			}

			this.publicationsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataPosts.loadingData = false;

						if (!res || res.length == 0) {
							this.dataPosts.noData = true;
						} else {
							this.dataPosts.loadMoreData = (!res || res.length < this.environment.cuantity*3) ? false : true;

							for (let i in res) {
								// Push items
								this.dataPosts.list.push(res[i]);

								// Push add
								if (i == '10' || i == '20' || i == '30' || i == '40')
									this.dataPosts.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity*3)
							this.dataPosts.noMore = true;
					}, 600);
				}, error => {
					this.dataPosts.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataPosts.noMore && !this.dataPosts.loadingMoreData) {
			this.dataPosts.loadingMoreData = true;
			this.dataPosts.rows++;

			let data = {
				caption: this.dataPosts.searchCaption,
				rows: this.dataPosts.rows,
				cuantity: this.environment.cuantity*3
			}

			this.publicationsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataPosts.loadMoreData = (!res || res.length < this.environment.cuantity*3) ? false : true;
						this.dataPosts.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (let i in res){
								// Push items
								this.dataPosts.list.push(res[i]);

								// Push add
								if (i == '15' || i == '30' || i == '45' || i == '60')
									this.dataPosts.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity*3)
							this.dataPosts.noMore = true;
					}, 600);
				}, error => {
					this.dataPosts.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Tag
	tag(type){
		if (type == 'default') {
			this.dataTag = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false,
				searchCaption: this.data.newSearchCaption
			}

			let data = {
				caption: this.dataTag.searchCaption,
				rows: this.dataTag.rows,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.searchTag(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataTag.loadingData = false;

						if (!res || res.length == 0) {
							this.dataTag.noData = true;
						} else {
							this.dataTag.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;

							// Push items
							for (let i in res)
								this.dataTag.list.push(res[i]);
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataTag.noMore = true;
					}, 600);
				}, error => {
					this.dataTag.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataTag.noMore && !this.dataTag.loadingMoreData) {
			this.dataTag.loadingMoreData = true;
			this.dataTag.rows++;

			let data = {
				caption: this.dataTag.searchCaption,
				rows: this.dataTag.rows,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.searchTag(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataTag.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataTag.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								this.dataTag.list.push(res[i]);

						if (!res || res.length < this.environment.cuantity)
							this.dataTag.noMore = true;
					}, 600);
				}, error => {
					this.dataTag.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Set hashtag
	setHashtag(type, item){
		if (type == 'set') {
			if (this.ssrService.isBrowser) {
				this.window.scrollTo(0, 0);
			}
			this.data.active = 'hashtag';
			this.data.selectedHashtag = item.caption;
			this.setHashtag('default', item);
		} else if (type == 'close') {
			this.data.active = 'search';
		} else if (type == 'default') {
			this.dataHashtag = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false,
				searchCaption: item.caption.replace( /#/g, '')
			}

			let data = {
				caption: this.dataHashtag.searchCaption,
				rows: this.dataHashtag.rows,
				cuantity: this.environment.cuantity*3
			}

			this.publicationsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataHashtag.loadingData = false;

						if (!res || res.length == 0) {
							this.dataHashtag.noData = true;
						} else {
							this.dataHashtag.loadMoreData = (!res || res.length < this.environment.cuantity*3) ? false : true;

							for (let i in res) {
								// Push items
								this.dataHashtag.list.push(res[i]);

								// Push add
								if (i == '10' || i == '20' || i == '30' || i == '40')
									this.dataHashtag.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity*3)
							this.dataHashtag.noMore = true;
					}, 600);
				}, error => {
					this.dataHashtag.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataHashtag.noMore && !this.dataHashtag.loadingMoreData) {
			this.dataHashtag.loadingMoreData = true;
			this.dataHashtag.rows++;

			let data = {
				caption: this.dataHashtag.searchCaption,
				rows: this.dataHashtag.rows,
				cuantity: this.environment.cuantity*3
			}

			this.publicationsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataHashtag.loadMoreData = (!res || res.length < this.environment.cuantity*3) ? false : true;
						this.dataHashtag.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (let i in res){
								// Push items
								this.dataHashtag.list.push(res[i]);

								// Push add
								if (i == '15' || i == '30' || i == '45' || i == '60')
									this.dataHashtag.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity*3)
							this.dataHashtag.noMore = true;
					}, 600);
				}, error => {
					this.dataHashtag.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}
}
