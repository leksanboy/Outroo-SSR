import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';

declare var ga: Function;
declare var global: any;

@Component({
	selector: 'app-followers',
	templateUrl: './followers.component.html'
})
export class FollowersComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public dataDefault: any = [];
	public dataSearch: any = [];
	public data: any = {
		active: 'default'
	};
	public activeRouter: any;
	public activeLanguage: any;
	public deniedAccessOnlySession: boolean;
	public actionFormSearch: FormGroup;

	constructor(
		private router: Router,
		private _fb: FormBuilder,
		private location: Location,
		private titleService: Title,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private followsDataService: FollowsDataService,
		private notificationsDataService: NotificationsDataService
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
					this.window.scrollTo(0, 0);

					// Get url data
					let urlData: any = this.activatedRoute.snapshot.params.id;

					// Get user data
					this.siteUserData(urlData);

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
				if (this.data.active == 'default')
					if (this.dataDefault.list.length > 0)
						this.default('more', null, null);
				else if (this.data.active == 'search')
					if (this.dataSearch.list.length > 0)
						this.search('more');
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
				(val.length > 0) ? this.search('default') : this.search('clear');
			});
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeLanguage.unsubscribe();
	}

	// Go back
	goBack(){
		// this.location.back();
		this.router.navigate([this.userData.username]);
	}

	// User Data of the Page
	siteUserData(id){
		this.userDataService.getUserData(id)
			.subscribe(res => {
				// User data
				this.userData = res;

				// Set Document title
				this.titleService.setTitle(this.userData.name + ' - ' + this.translations.followers);

				// Data
				let data = {
					sender: this.sessionData ? this.sessionData.current.id : 0,
					receiver: this.userData.id
				}

				// Check if following
				if (this.sessionData) {
					this.followsDataService.checkFollowing(data)
						.subscribe(res => {
							this.userData.status = res;
						});
				}

				// Set Google analytics
				let urlGa =  '[' + res.id + ']/' + id + '/followers';
				ga('set', 'page', urlGa);
				ga('send', 'pageview');
			});
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Follow / Unfollow
	followUnfollow(type, item){
		if (type == 'follow')
			item.status = item.private ? 'pending' : 'following';
		else if (type == 'unfollow')
			item.status = 'unfollow';

		let data = {
			type: item.status,
			private: item.private,
			sender: this.sessionData.current.id,
			receiver: item.user.id
		}

		this.followsDataService.followUnfollow(data).subscribe();
	}

	// Default
	default(type, user, session){
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
				user: user,
				session: session,
				type: 'followers',
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity
			}

			this.followsDataService.default(data)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (!res || res.length == 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (res.length < this.environment.cuantity) ? false : true;
						this.dataDefault.list = res;
					}
					
					if (!res || res.length < this.environment.cuantity)
						this.dataDefault.noMore = true;
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				user: this.userData.id,
				session: this.sessionData.current.id,
				type: 'followers',
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity
			}

			this.followsDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataDefault.loadMoreData = (res.length < this.environment.cuantity) ? false : true;
						this.dataDefault.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								this.dataDefault.list.push(res[i]);

						if (!res || res.length < this.environment.cuantity)
							this.dataDefault.noMore = true;
					}, 600);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		}
	}

	// Search
	search(type){
		if (type == 'default') {
			this.data.active = 'search';
			this.dataSearch = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noData: false,
				noMore: false
			}

			let data = {
				session: this.sessionData.current.id,
				user: this.userData.id,
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: this.environment.cuantity
			}

			this.followsDataService.searchFollowing(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadingData = false;

						if (!res || res.length == 0) {
							this.dataSearch.noData = true;
						} else {
							this.dataSearch.loadMoreData = (res.length < this.environment.cuantity) ? false : true;
							this.dataSearch.list = res;
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataSearch.noMore = true;
					}, 600);
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataSearch.noMore && !this.dataSearch.loadingMoreData) {
			this.dataSearch.loadingMoreData = true;
			this.dataSearch.rows++;

			let data = {
				session: this.sessionData.current.id,
				user: this.userData.id,
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: this.environment.cuantity
			}

			this.followsDataService.searchFollowing(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadMoreData = (res.length < this.environment.cuantity) ? false : true;
						this.dataSearch.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								this.dataSearch.list.push(res[i]);

						if (!res || res.length < this.environment.cuantity)
							this.dataSearch.noMore = true;
					}, 600);
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'clear') {
			this.data.active = 'default';
			this.actionFormSearch.get('caption').setValue('');
		}
	}
}
