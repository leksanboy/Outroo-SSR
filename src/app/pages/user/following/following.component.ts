import { Title } from '@angular/platform-browser';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

declare var global: any;

@Component({
	selector: 'app-following',
	templateUrl: './following.component.html'
})
export class FollowingComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public dataDefault: any = [];
	public dataSearch: any = [];
	public data: any = {
		active: 'default'
	};
	public activeLanguage: any;
	public deniedAccessOnlySession: boolean;
	public actionFormSearch: FormGroup;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private _fb: FormBuilder,
		private location: Location,
		private titleService: Title,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private followsDataService: FollowsDataService,
		private notificationsDataService: NotificationsDataService,
		private ssrService: SsrService,
		private routingStateService: RoutingStateService,
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// User
		this.userData = this.activatedRoute.snapshot.data.userResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Search
		this.actionFormSearch = this._fb.group({
			caption: ['']
		});

		// Word for search if not found between friends
		this.data.searchWord = this.userData.username.charAt(0);

		// Data
		if (this.sessionData) {
			// Set Google analytics
			const url = 'following';
			const title = this.userData.name + ' - ' + this.translations.followers.title;
			const userId = this.sessionData.current.id;
			this.userDataService.analytics(url, title, userId);

			// Set title
			this.titleService.setTitle(title);

			// Check if following
			const data = { receiver: this.userData ? this.userData.id : null };
			this.followsDataService.checkFollowing(data)
				.subscribe(res => {
					this.userData.status = res;
				});

			// Load default
			this.default('default', this.userData.id);
		} else {
			this.deniedAccessOnlySession = true;
		}

		// Denied
		if (!this.sessionData) {
			this.deniedAccessOnlySession = true;
		} else if (this.userData.id !== this.sessionData.current.id && this.userData.private && this.userData.status !== 'following') {
			this.deniedAccessOnlySession = true;
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
				if (!this.deniedAccessOnlySession) {
					if (this.data.active === 'default') {
						if (this.dataDefault.list.length > 0) {
							this.default('more', null);
						}
					} else if (this.data.active === 'search') {
						if (this.dataSearch.list.length > 0) {
							this.search('more');
						}
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
				this.data.searchWord = val;
				(val.length > 0) ? this.search('default') : this.search('clear');
			});
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
				this.titleService.setTitle(this.userData.name + ' - ' + this.translations.followers.title);
			});
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
			receiver: item.user.id
		};

		this.followsDataService.followUnfollow(data).subscribe();
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
				user: user,
				type: 'following',
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.followsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadingData = false;

					if (!res || res.length === 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (res.length < this.env.cuantity) ? false : true;
						this.dataDefault.list = res;
					}

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
				user: this.userData.id,
				type: 'following',
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.followsDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadMoreData = (res.length < this.env.cuantity) ? false : true;
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

	// Search
	search(type) {
		if (type === 'default') {
			this.data.active = 'search';
			this.dataSearch = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			};

			const data = {
				user: this.userData.id,
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: this.env.cuantity
			};

			this.followsDataService.searchFollowing(data)
				.subscribe((res: any) => {
					this.dataSearch.loadingData = false;

					if (!res || res.length === 0) {
						this.dataSearch.noData = true;
					} else {
						this.dataSearch.loadMoreData = (res.length < this.env.cuantity) ? false : true;
						this.dataSearch.list = res;
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataSearch.noMore = true;
					}
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataSearch.noMore && !this.dataSearch.loadingMoreData) {
			this.dataSearch.loadingMoreData = true;
			this.dataSearch.rows++;

			const data = {
				user: this.userData.id,
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: this.env.cuantity
			};

			this.followsDataService.searchFollowing(data)
				.subscribe((res: any) => {
					this.dataSearch.loadMoreData = (res.length < this.env.cuantity) ? false : true;
					this.dataSearch.loadingMoreData = false;

					// Push items
					if (!res || res.length > 0) {
						for (const i in res) {
							if (i) {
								this.dataSearch.list.push(res[i]);
							}
						}
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataSearch.noMore = true;
					}
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'clear') {
			this.data.active = 'default';
			this.actionFormSearch.get('caption').setValue('');
			this.data.searchWord = this.userData.username.charAt(0);
		}
	}
}
