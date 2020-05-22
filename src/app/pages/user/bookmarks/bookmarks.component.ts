import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var global: any;

@Component({
	selector: 'app-bookmarks',
	templateUrl: './bookmarks.component.html',
	providers: [ SafeHtmlPipe ]
})
export class BookmarksComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public dataDefault: any = [];
	public dataSearch: any = [];
	public activeLanguage: any;
	public hideAd: boolean;

	constructor(
		private router: Router,
		public dialog: MatDialog,
		private location: Location,
		private titleService: Title,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private publicationsDataService: PublicationsDataService,
		private routingStateService: RoutingStateService,
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Data
		if (this.sessionData) {
			// Set Google analytics
			const url = 'bookmarks';
			const title = this.translations.bookmarks.title;
			const userId = this.sessionData.current.id;
			this.userDataService.analytics(url, title, userId);

			// Set title
			this.titleService.setTitle(title);

			// Load default
			this.default('default', this.sessionData.current.username);
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
					this.default('more', this.sessionData.current.username);
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
				this.titleService.setTitle(this.translations.bookmarks.title);
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

			const data = {
				type: 'bookmarks',
				user: user,
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity * 3
			};

			this.publicationsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadingData = false;

					if (!res || res.length === 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity * 3) ? false : true;

						for (const i in res) {
							if (i) {
								this.dataDefault.list.push(res[i]);

								// Push add
								if (i === '10' || i === '29' || i === '48' || i === '67' || i === '86') {
									this.dataDefault.list.push(this.pushAd());
								}
							}
						}
					}

					if (!res || res.length < this.env.cuantity * 3) {
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
				type: 'news',
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity * 3
			};

			this.publicationsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity * 3) ? false : true;
					this.dataDefault.loadingMoreData = false;

					if (!res || res.length > 0) {
						for (const i in res) {
							if (i) {
								this.dataDefault.list.push(res[i]);

								// Push add
								if (i === '10' || i === '29' || i === '48' || i === '67' || i === '86') {
									this.dataDefault.list.push(this.pushAd());
								}
							}
						}
					}

					if (!res || res.length < this.env.cuantity * 3) {
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
						userData: this.sessionData.current,
						item: item
					}
				};

				const dialogRef = this.dialog.open(ShowPublicationComponent, config);
				dialogRef.afterClosed().subscribe((res: any) => {
					this.location.go(this.router.url);

					item.bookmarkRemoved = !res.bookmark.checked;
				});
				break;
		}
	}
}
