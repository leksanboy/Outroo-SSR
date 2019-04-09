import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { BookmarksDataService } from '../../../../app/core/services/user/bookmarksData.service';
import { PhotoDataService } from '../../../../app/core/services/user/photoData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

import { ShowPhotoComponent } from '../../../../app/pages/common/showPhoto/showPhoto.component';
import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var ga: Function;
declare var global: any;

@Component({
	selector: 'app-bookmarks',
	templateUrl: './bookmarks.component.html',
	providers: [ SafeHtmlPipe ]
})
export class BookmarksComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public dataDefault: any = [];
	public dataSearch: any = [];
	public activeRouter: any;
	public activeLanguage: any;
	public deniedAccessOnlySession: boolean;
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
		private photoDataService: PhotoDataService,
		private bookmarksDataService: BookmarksDataService,
		private publicationsDataService: PublicationsDataService,
		private ssrService: SsrService
	) {
		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

		// Check session exists
		if (!this.sessionData) {
			this.deniedAccessOnlySession = true;
			this.sessionData = [];
			this.sessionData.current = {
				id: null
			};
		}

		// Set component data
		this.activeRouter = this.router.events
			.subscribe(event => {
				if(event instanceof NavigationEnd) {
					// Go top of page on change user
					if (this.ssrService.isBrowser) {
						this.window.scrollTo(0, 0);
					}

					// Get url data
					let urlData: any = this.activatedRoute.snapshot.params.id;

					// Load default
					this.default('default', urlData, this.sessionData.current.id);
				}
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

			if (windowBottom >= docHeight)
				if (this.dataDefault.list.length > 0)
					this.default('more', null, null);
		}
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeLanguage.unsubscribe();
	}

	// Go back
	goBack(){
		// this.location.back();
		this.router.navigate([this.sessionData.current.username]);
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
				this.titleService.setTitle(this.translations.bookmarks);
			});
	}

	// Default
	default(type, user, session) {
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
				session: session,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity*3
			}

			this.bookmarksDataService.default(data)
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
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				session: this.sessionData.current.id,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity*3
			}

			this.bookmarksDataService.default(data)
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
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		}
	}

	// Show publication
	show(item, line, index) {
		item.line = line;
		item.index = index;

		let data = {
			name: item.name,
			session: this.sessionData.current.id
		}

		this.publicationsDataService.getDataByName(data)
			.subscribe((res: any) => {
				this.location.go(this.router.url + '#publication');

				res.bookmark = item.marked ? item.bookmark : res.bookmark;

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
					// Set mark if is deleted
					this.dataDefault.list[item.line][item.index].marked = result.marked;
					this.dataDefault.list[item.line][item.index].bookmark = result.bookmark;

					// Set url
					this.location.go(this.router.url);
				});
			});
	}
}
