import { DOCUMENT, DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

import { NewPlaylistComponent } from '../../../../app/pages/common/newPlaylist/newPlaylist.component';
import { ShowPlaylistComponent } from '../../../../app/pages/common/showPlaylist/showPlaylist.component';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var ga: Function;
declare var global: any;

@Component({
	selector: 'app-audios',
	templateUrl: './audios.component.html',
	providers: [ SafeHtmlPipe ]
})
export class AudiosComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public userData: any = [];
	public dataSearch: any = [];
	public dataDefault: any = [];
	public dataAround: any = [];
	public dataTop: any = [];
	public dataFresh: any = [];
	public data: any = {
		selectedIndex: 0,
		active: 'default',
		path: 'assets/media/audios/'
	};
	public dataFiles: any = {
		list: [],
		reload: false,
		actions: true,
		saveDisabled: false,
		counter: 0
	};
	public activeRouter: any;
	public activeSessionPlaylists: any;
	public activePlayerInformation: any;
	public activeLanguage: any;
	public actionFormSearch: FormGroup;
	public hideAd: boolean;
	public audio = new Audio();

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
		private audioDataService: AudioDataService,
		private ssrService: SsrService
	) {
		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

		// Check if session exists
		if (!this.sessionData) {
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

					// Get user data
					this.siteUserData(urlData);

					// Load default
					this.data.selectedIndex = 0;
					this.default('default', urlData);
				}
			});

		// Session playlists
		this.activeSessionPlaylists = this.sessionService.getDataPlaylists()
			.subscribe(data => {
				if (this.userData.id == this.sessionData.current.id){
					if (data.current.playlists[0].id != this.dataDefault.playlists[0].id){
						data.current.playlists[0].color = this.generateRandomColor();
						this.dataDefault.playlists.unshift(data.current.playlists[0]);
					}
				}
			});

		// Get player data
		this.activePlayerInformation = this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
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
					switch (this.data.selectedIndex) {
						case 0:
							if (this.dataDefault.list.length > 0)
								this.default('more', null);
							break;
						case 1:
							if (this.dataAround.list.length > 0)
								this.around('more');
							break;
						case 2:
							if (this.dataTop.list.length > 0)
								this.top('more');
							break;
						case 3:
							if (this.dataFresh.list.length > 0)
								this.fresh('more');
							break;
					}
				} else if (this.data.active == 'search') {
					if (this.dataSearch.list.length > 0)
						this.search('more');
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
				(val.length > 0) ? this.search('default') : this.search('clear');
			});
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeSessionPlaylists.unsubscribe();
		this.activePlayerInformation.unsubscribe();
		this.activeLanguage.unsubscribe();
	}

	// Go back
	goBack(){
		// this.location.back();
		this.router.navigate([this.userData.username]);
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

	// User Data of the Page
	siteUserData(id){
		this.userDataService.getUserData(id)
			.subscribe(res => {
				this.userData = res;

				// Set document title
				this.titleService.setTitle(this.userData.name + ' - ' + this.translations.audios.title);

				// Set Google analytics
				let urlGa =  '[' + res.id + ']/' + id + '/songs';
				ga('set', 'page', urlGa);
				ga('send', 'pageview');

				// Set playlist current playing
				if (this.sessionData.current.listInformation && this.sessionData.current.listInformation.user == res.id)
					this.audioPlayerData = this.sessionData.current.listInformation;
			});
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Set tab on click
	setTab(tab){
		switch (tab) {
			case 0:
				if (!this.dataDefault.list)
					// not in use
				break;
			case 1:
				if (!this.dataAround.list)
					this.around('default');
				break;
			case 2:
				if (!this.dataTop.list)
					this.top('default');
				break;
			case 3:
				if (!this.dataFresh.list)
					this.fresh('default');
				break;
		}
	}

	// Default
	default(type, user){
		if (type == 'default') {
			this.dataDefault = {
				list: [],
				playlists: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			}

			let data = {
				user: user,
				session: this.sessionData.current.id,
				type: 'default',
				rows: this.dataDefault.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.default(data)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (!res || res.length == 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;

						for (let i in res) {
							// Push items
							this.dataDefault.list.push(res[i]);

							// Push ad
							if (i == (Math.round(res.length*3/5)).toString())
								this.dataDefault.list.push(this.pushAd());
						}

						// Check playing item
						// TODO: Hacer una funcion que comprube la cancion que esta sonando si es de esta pantalla
						// if (this.audioPlayerData.type == 'default')
						// 	if ((res.length-1) >= this.audioPlayerData.key)
						// 		this.dataDefault.list[this.audioPlayerData.key] = this.audioPlayerData.item;
					}

					if (!res || res.length < this.environment.cuantity)
						this.dataDefault.noMore = true;
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});

			// Get playlists
			this.audioDataService.defaultPlaylists(data)
				.subscribe(res => {
					for (let i in res)
						res[i].color = this.generateRandomColor();

					this.dataDefault.playlists = res;
				});
		} else if (type == 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				user: this.userData.id,
				type: 'default',
				rows: this.dataDefault.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataDefault.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (let i in res){
								// Push items
								this.dataDefault.list.push(res[i]);

								// Push ad
								if (i == (Math.round(res.length*3/5)).toString())
									this.dataDefault.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataDefault.noMore = true;
					}, 600);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Around
	around(type){
		if (type == 'default') {
			this.dataAround = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			}

			let data = {
				type: 'around',
				rows: this.dataAround.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataAround.loadingData = false;

						if (!res || res.length == 0) {
							this.dataAround.noData = true;
						} else {
							this.dataAround.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;

							for (let i in res) {
								// Push items
								this.dataAround.list.push(res[i]);

								// Push ad
								if (i == (Math.round(res.length*3/5)).toString()){
									setTimeout(() => {
										this.dataAround.list.push(this.pushAd());
									}, 300);
								}
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataAround.noMore = true;
					}, 600);
				}, error => {
					this.dataAround.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataAround.noMore && !this.dataAround.loadingMoreData) {
			this.dataAround.loadingMoreData = true;
			this.dataAround.rows++;

			let data = {
				type: 'around',
				rows: this.dataAround.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataAround.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataAround.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (let i in res){
								// Push items
								this.dataAround.list.push(res[i]);

								// Push ad
								if (i == (Math.round(res.length*3/5)).toString())
									this.dataAround.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataAround.noMore = true;
					}, 600);
				}, error => {
					this.dataAround.loadingData = false;
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
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			}

			let data = {
				type: 'top',
				rows: this.dataTop.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataTop.loadingData = false;

						if (!res || res.length == 0) {
							this.dataTop.noData = true;
						} else {
							this.dataTop.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;

							for (let i in res) {
								// Push items
								this.dataTop.list.push(res[i]);

								// Push ad
								if (i == (Math.round(res.length*3/5)).toString()){
									setTimeout(() => {
										this.dataTop.list.push(this.pushAd());
									}, 600);
								}
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataTop.noMore = true;
					}, 600);
				}, error => {
					this.dataTop.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});

			// Get playlists
			this.audioDataService.defaultPlaylists(data)
				.subscribe(res => {
					for (let i in res)
						res[i].color = this.generateRandomColor();

					this.dataTop.playlists = res;
				});
		} else if (type == 'more' && !this.dataTop.noMore && !this.dataTop.loadingMoreData) {
			this.dataTop.loadingMoreData = true;
			this.dataTop.rows++;

			let data = {
				type: 'top',
				rows: this.dataTop.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataTop.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataTop.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (let i in res){
								// Push items
								this.dataTop.list.push(res[i]);

								// Push ad
								if (i == (Math.round(res.length*3/5)).toString())
									this.dataTop.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataTop.noMore = true;
					}, 600);
				}, error => {
					this.dataTop.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Fresh
	fresh(type){
		if (type == 'default') {
			this.dataFresh = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			}

			let data = {
				type: 'fresh',
				rows: this.dataFresh.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataFresh.loadingData = false;

						if (!res || res.length == 0) {
							this.dataFresh.noData = true;
						} else {
							this.dataFresh.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;

							for (let i in res) {
								// Push items
								this.dataFresh.list.push(res[i]);

								// Push ad
								if (i == (Math.round(res.length*3/5)).toString()){
									setTimeout(() => {
										this.dataFresh.list.push(this.pushAd());
									}, 900);
								}
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataFresh.noMore = true;
					}, 600);
				}, error => {
					this.dataFresh.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataFresh.noMore && !this.dataFresh.loadingMoreData) {
			this.dataFresh.loadingMoreData = true;
			this.dataFresh.rows++;

			let data = {
				type: 'fresh',
				rows: this.dataFresh.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataFresh.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataFresh.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (let i in res){
								// Push items
								this.dataFresh.list.push(res[i]);

								// Push ad
								if (i == (Math.round(res.length*3/5)).toString())
									this.dataFresh.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataFresh.noMore = true;
					}, 600);
				}, error => {
					this.dataFresh.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
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
				noMore: false,
				noData: false
			}

			let data = {
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadingData = false;

						if (!res || res.length == 0) {
							this.dataSearch.noData = true;
						} else {
							this.dataSearch.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;

							for (let i in res) {
								// Push items
								this.dataSearch.list.push(res[i]);

								// Push ad
								if (i == (Math.round(res.length*3/5)).toString())
									this.dataSearch.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataSearch.noMore = true;
					}, 600);
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataSearch.noMore && !this.dataSearch.loadingMoreData) {
			this.dataSearch.loadingMoreData = true;
			this.dataSearch.rows++;

			let data = {
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: environment.cuantity
			}

			this.audioDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataSearch.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (let i in res){
								// Push items
								this.dataSearch.list.push(res[i]);

								// Push ad
								if (i == (Math.round(res.length*3/5)).toString())
									this.dataSearch.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataSearch.noMore = true;
					}, 600);
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'clear') {
			this.data.active = 'default';
			this.actionFormSearch.get('caption').setValue('');
		}
	}

	// Upload files
	uploadFiles(type, event){
		let convertToMb = function(bytes) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes))
				return '-';

			let units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));

			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) +  ' ' + units[number];
		}

		if (type == 1) { // Add files
			this.dataFiles.saveDisabled = false;

			for (let i = 0; i < event.currentTarget.files.length; i++) {
				let file = event.currentTarget.files[i];
				file.title = file.name.replace('.mp3', '');
				file.status = 'clear';
				file.user = this.sessionData.current.id;

				if (file.size >= 20000000) {
					file.sizeBig = convertToMb(file.size);
					this.dataFiles.saveDisabled = true;
				}

				if (/^audio\/\w+$/.test(file.type)) {
					file.category = 'audio';
				} else {
					file.category = 'unknown';
					this.dataFiles.saveDisabled = true;
				}

				this.dataFiles.list.push(file);
			}
		} else if (type == 2) { // Cancel
			this.dataFiles.list = [];
		} else if (type == 3) { // Remove 1 by 1
			this.dataFiles.list.splice(event, 1);

			for (let i in this.dataFiles.list) {
				if (this.dataFiles.list[i].category == 'unknown' || this.dataFiles.list[i].sizeBig) {
					this.dataFiles.saveDisabled = true;
					return true;
				} else {
					this.dataFiles.saveDisabled = false;
				}
			}
		} else if (type == 4) { // Save & Upload
			this.dataFiles.actions = false;
			let self = this;

			const ajaxCall = function(file, formdata, ajax) {
				formdata.append("fileUpload", file);
				formdata.append("user", file.user);
				formdata.append("category", file.category);
				formdata.append("title", file.title);

				ajax.upload.addEventListener("progress", function(ev){
					progressHandler(ev, file);
				}, false);

				ajax.addEventListener("load", function(ev){
					completeHandler(ev, file);
				}, false);

				ajax.addEventListener("error", function(ev){
					errorHandler(ev, file);
				}, false);

				ajax.addEventListener("abort", function(ev){
					abortHandler(ev, file);
				}, false);

				ajax.open("POST", "./assets/api/audios/uploadFiles.php");
				ajax.send(formdata);
			}

			const progressHandler = function(event, file) {
				file.status = 'progress';
				let percent = Math.round((event.loaded / event.total) * 100);
				file.progress = Math.max(0, Math.min(100, percent));
			}

			const completeHandler = function(event, file) {
				file.status = 'completed';
				counterHandler();
			}

			const errorHandler = function(event, file) {
				file.status = 'error';
				counterHandler();
			}

			const abortHandler = function(event, file) {
				file.status = 'error';
				counterHandler();
			}

			const counterHandler = function() {
				self.dataFiles.counter = self.dataFiles.counter+1;
				self.dataFiles.reload = (self.dataFiles.list.length == self.dataFiles.counter) ? true : false;
			}

			for (let i in this.dataFiles.list) {
				this.dataFiles.list[i].status = 'progress';

				let file = this.dataFiles.list[i],
					formdata = new FormData(),
					ajax = new XMLHttpRequest();

				ajaxCall(file, formdata, ajax);
			}
		} else if (type == 5) { // Reload
			this.data.selectedIndex = 0;
			this.default('default', this.sessionData.current.username);

			this.dataFiles = {
				list: [],
				reload: false,
				actions: true,
				saveDisabled: false,
				counter: 0
			}
		}
	}

	// Generate random color
	generateRandomColor(){
		let rand = Math.floor(Math.random() * 40) + 0,
			colorsList = [
				"linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
				"linear-gradient(to right, #43e97b 0%, #38f9d7 100%)",
				"linear-gradient(to right, #fa709a 0%, #fee140 100%)",
				"linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
				"linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)",
				"linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
				"linear-gradient(to right bottom, #a18cd1 0%, #fbc2eb 100%)",
				"linear-gradient(to right bottom, #fbc2eb 0%, #a6c1ee 100%)",
				"linear-gradient(to right bottom, #30cfd0 0%, #330867 100%)",
				"linear-gradient(to right bottom, #5ee7df 0%, #b490ca 100%)",
				"linear-gradient(to right bottom, #cd9cf2 0%, #f6f3ff 100%)",
				"linear-gradient(to right bottom, #37ecba 0%, #72afd3 100%)",
				"linear-gradient(to right bottom, #c471f5 0%, #fa71cd 100%)",
				"linear-gradient(to right bottom, #48c6ef 0%, #6f86d6 100%)",
				"linear-gradient(to right bottom, #ff0844 0%, #ffb199 100%)",
				"linear-gradient(to right bottom, #96fbc4 0%, #f9f586 100%)",
				"linear-gradient(to right bottom, #c71d6f 0%, #d09693 100%)",
				"linear-gradient(to right bottom, #4481eb 0%, #04befe 100%)",
				"linear-gradient(to right bottom, #e8198b 0%, #c7eafd 100%)",
				"linear-gradient(to right bottom, #209cff 0%, #68e0cf 100%)",
				"linear-gradient(to right bottom, #cc208e 0%, #6713d2 100%)",
				"linear-gradient(to right bottom, #b224ef 0%, #7579ff 100%)",
				"linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
				"linear-gradient(60deg, #96deda 0%, #50c9c3 100%)",
				"linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
				"linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
				"linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
				"linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)",
				"linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
				"linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
				"linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
				"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				"linear-gradient(180deg, #2af598 0%, #009efd 100%)",
				"linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%)",
				"linear-gradient(-60deg, #16a085 0%, #f4d03f 100%)",
				"linear-gradient(-60deg, #ff5858 0%, #f09819 100%)"
				// --> https://webgradients.com/
			];

		return colorsList[rand];
	}

	// Play item song
	playItem(data, item, key, type) {
		if (!this.sessionData.current.id) {
			this.alertService.success(this.translations.common.createAnAccountToListenSong);
		} else {
			if (this.audioPlayerData.key == key && this.audioPlayerData.type == type && this.audioPlayerData.item.song == item.song) { // Play/Pause current
				item.playing = !item.playing;
				this.playerService.setPlayTrack(this.audioPlayerData);
			} else { // Play new one
				this.audioPlayerData.list = data;
				this.audioPlayerData.item = item;
				this.audioPlayerData.key = key;
				this.audioPlayerData.user = this.userData.id;
				this.audioPlayerData.username = this.userData.username;
				this.audioPlayerData.location = 'audios';
				this.audioPlayerData.type = type;
				this.audioPlayerData.selectedIndex = this.data.selectedIndex;

				this.playerService.setData(this.audioPlayerData);
				item.playing = true;
			}
		}
	}

	// Item options
	itemOptions(type, item, playlist){
		switch(type){
			case("addRemoveSession"):
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				let dataARS = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'session',
					id: item.id
				}

				this.audioDataService.addRemove(dataARS)
					.subscribe(res => {
						// let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
						// 	text = !item.addRemoveSession ? (' ' + this.translations.common.hasBeenAdded) : (' ' + this.translations.common.hasBeenRemoved);
						// this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case("addRemoveUser"):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				let dataARO = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.song
				}

				this.audioDataService.addRemove(dataARO)
					.subscribe(res => {
						item.insertedId = res;
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case("playlist"):
				item.removeType = !item.addRemoveUser ? "add" : "remove";

				let dataP = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				}

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = ' ' + this.translations.common.hasBeenAddedTo + ' ' + playlist.title;
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case("report"):
				item.type = 'audio';
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Share on social media
	shareOn(type, item){
		switch (type) {
			case "message":
				item.comeFrom = 'shareSong';
				this.sessionService.setDataShowConversation(item);
				break;
			case "newTab":
				let url = this.environment.url + 's/' + item.name.slice(0, -4);
				this.window.open(url, '_blank');
				break;
			case "copyLink":
				let urlExtension = this.environment.url + 's/' + item.name.slice(0, -4);
				this.sessionService.setDataCopy(urlExtension);
				break;
		}
	}

	// Create new playlist
	createPlaylist(){
		let data = 'create';
		this.sessionService.setDataCreatePlaylist(data);
	}

	// Show playlist
	showPlaylist(item){
		this.location.go('/' + this.userData.username + '/songs#showPlaylist');

		let config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				userData: this.userData,
				translations: this.translations,
				item: item,
				listInformation: this.audioPlayerData,
				path: this.data.path
			}
		};

		let dialogRef = this.dialog.open(ShowPlaylistComponent, config);
		dialogRef.afterClosed().subscribe((res: string) => {
			this.location.go('/' + this.userData.username + '/songs');
		});
	}

	// Update playlist
	updatePlaylist(type, data){
		if (type == 'create'){
			if (this.userData.id == this.sessionData.current.id){
				data.color = this.generateRandomColor();
				this.dataDefault.playlists.unshift(data);
			}

			this.sessionData.current.playlists.unshift(data);
		} else if (type == 'edit'){
			this.dataDefault.playlists[data.index].title = data.item.title;
			this.dataDefault.playlists[data.index].image = data.item.image;
			this.sessionData.current.playlists = this.dataDefault.playlists;
		} else if (type == 'addRemoveSession') {
			this.sessionData.current.playlists = this.dataDefault.playlists;
		} else if (type == 'addRemoveUser') {
			if (data.type == 'add')
				this.sessionData.current.playlists.unshift(data);
			else
				for (let i in this.sessionData.current.playlists)
					if (this.sessionData.current.playlists[i].id = data.id)
						this.sessionData.current.playlists[i] = data;
		}

		// Update playslists on selects
		this.sessionData = this.userDataService.setSessionData('update', this.sessionData.current);
		this.sessionService.setDataPlaylists(this.sessionData);
	}

	// Item options
	itemOptionsPlaylist(type, item, index){
		switch(type){
			case("edit"):
				this.location.go('/' + this.userData.username + '/songs#editPlaylist');
				item.path = this.data.path;
				item.index = index;

				let config = {
					disableClose: false,
					data: {
						type: 'edit',
						sessionData: this.sessionData,
						translations: this.translations,
						item: item
					}
				};

				let dialogRef = this.dialog.open(NewPlaylistComponent, config);
				dialogRef.afterClosed().subscribe((res: any) => {
					this.location.go('/' + this.userData.username + '/audios');

					if (res) {
						let data = {
							index: res.index,
							item: res
						}

						this.updatePlaylist('edit', data);
					}
				});
				break;
			case("publicPrivate"):
				item.private = !item.private;
				item.type = item.private ? "private" : "public";

				let dataPPS = {
					user: this.sessionData.current.id,
					type: item.type,
					id: item.id
				}

				this.audioDataService.publicPrivate(dataPPS).subscribe();
				break;
			case("addRemoveSession"):
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = !item.addRemoveSession ? "add" : "remove";
				item.removed = item.addRemoveSession ? false : true;

				let dataARS = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'session',
					id: item.idPlaylist
				}

				this.audioDataService.addRemovePlaylist(dataARS)
					.subscribe((res: any) => {
						this.updatePlaylist('addRemoveSession', null);
					});
				break;
			case("addRemoveUser"):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? "add" : "remove";
				item.removed = !item.addRemoveUser ? false : true;

				let dataARO = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'user',
					id: item.id,
					title: item.title,
					image: item.image,
					playlist : item.idPlaylist,
					insertedPlaylist : item.insertedPlaylist
				}

				this.audioDataService.addRemovePlaylist(dataARO)
					.subscribe((res: any) => {
						item.idPlaylist = res;
						item.insertedPlaylist =  item.insertedPlaylist ? item.insertedPlaylist : res;
						this.updatePlaylist('addRemoveUser', item);
					});
				break;
			case("addRemoveUserTop"):
				item.addRemoveUserTop = !item.addRemoveUserTop;
				item.removeType = item.addRemoveUserTop ? "add" : "remove";
				item.removed = !item.addRemoveUserTop ? false : true;

				let dataAROT = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'user',
					id: item.id,
					title: item.title,
					image: item.image,
					playlist : item.idPlaylist,
					insertedPlaylist : item.insertedPlaylist
				}

				this.audioDataService.addRemovePlaylist(dataAROT)
					.subscribe((res: any) => {
						item.idPlaylist = res;
						item.insertedPlaylist =  item.insertedPlaylist ? item.insertedPlaylist : res;
						this.updatePlaylist('addRemoveUser', item);
					});
				break;
			case("report"):
				item.type = 'audioPlaylist';
				this.sessionService.setDataReport(item);
				break;
		}
	}
}
