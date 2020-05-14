import { Title, DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

import { NewPlaylistComponent } from '../../../../app/pages/common/newPlaylist/newPlaylist.component';
import { ShowPlaylistComponent } from '../../../../app/pages/common/showPlaylist/showPlaylist.component';

import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

import * as _ from 'lodash';

declare var global: any;

@Component({
	selector: 'app-audios',
	templateUrl: './audios.component.html',
	providers: [SafeHtmlPipe]
})
export class AudiosComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public activeRouter: any;
	public sessionData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public userData: any = [];
	public dataSearch: any = [];
	public dataGeneral: any = [];
	public dataDefault: any = [];
	public dataAround: any = [];
	public dataSection: any = [];
	public dataTop: any = [];
	public dataFresh: any = [];
	public data: any = {
		content: 'default',
		active: 'default',
		selectedIndex: 0,
		path: 'assets/media/audios/'
	};
	public dataFiles: any = {
		list: [],
		reload: false,
		actions: true,
		counter: 0,
		max: 100
	};
	public activeSessionPlaylists: any;
	public activePlayerInformation: any;
	public activeLanguage: any;
	public deniedAccessOnlySession: boolean;
	public actionFormSearch: FormGroup;
	public hideAd: boolean;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private _fb: FormBuilder,
		public dialog: MatDialog,
		private location: Location,
		private titleService: Title,
		private alertService: AlertService,
		private playerService: PlayerService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
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

					// Close all dialogs
					this.dialog.closeAll();

					// Search form
					this.actionFormSearch = this._fb.group({
						caption: ['']
					});

					// Data
					if (this.userData) {
						// Set Google analytics
						const url = 'songs';
						const title = this.userData.name + ' - ' + this.translations.audios.title;
						const userId = this.sessionData ? (this.sessionData.current ? this.sessionData.current.id : null) : null;
						this.userDataService.analytics(url, title, userId);

						// Set title
						this.titleService.setTitle(title);

						// Reset
						this.search('clear')
						this.dataDefault = [];

						// Set playlist current playing
						if (this.sessionData) {
							if (this.sessionData.current.audioPlayerData && this.sessionData.current.audioPlayerData.user === this.userData.id) {
								this.audioPlayerData = this.sessionData.current.audioPlayerData;
							}

							// Load general
							if (this.sessionData.current.id === this.userData.id) {
								this.data.selectedIndex = 0;
								this.general(this.userData.id);
							} else {
								this.data.selectedIndex = 1;
								this.default('default', this.userData.id);
							}

							// Denied
							if (this.userData.id !== this.sessionData.current.id && this.userData.private && this.userData.status !== 'following') {
								this.deniedAccessOnlySession = true;
							}
						} else {
							this.data.selectedIndex = 1;
							this.default('default', this.userData.id);
						}
					}
				}
			});

		// Playlists
		this.activeSessionPlaylists = this.sessionService.getDataPlaylists()
			.subscribe(data => {
				if (this.userData.id === this.sessionData.current.id) {
					this.sessionData = data;

					if (this.dataDefault.playlists) {
						if (data.current.playlists[0].id !== this.dataDefault.playlists[0].id) {
							this.dataDefault.playlists.unshift(data.current.playlists[0]);
						}
					} else {
						this.dataDefault.playlists = [];
						this.dataDefault.playlists.push(data.current.playlists[0]);
					}
				}
			});

		// Audio data
		this.activePlayerInformation = this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
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
				if (!this.deniedAccessOnlySession) {
					if (this.data.content === 'default') {
						if (this.data.active === 'default') {
							switch (this.data.selectedIndex) {
								case 0:
									/* General: not in use, alwayys set */
									break;
								case 1:
									if (this.dataDefault.list.length > 0) {
										this.default('more', null);
									}
									break;
								case 2:
									if (this.dataAround.list.length > 0) {
										this.around('more');
									}
									break;
								case 3:
									if (this.dataTop.list.length > 0) {
										this.top('more');
									}
									break;
								case 4:
									if (this.dataFresh.list.length > 0) {
										this.fresh('more');
									}
									break;
							}
						} else if (this.data.active === 'search') {
							if (this.dataSearch.list.length > 0) {
								this.search('more');
							}
						}
					} else if (this.data.content === 'seeAll') {
						if (this.dataGeneral.list.length > 0) {
							this.seeAll('more');
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
				this.titleService.setTitle(this.userData.name + ' - ' + this.translations.audios.title);
			});
	}

	// Set tab on click
	setTab(tab) {
		if (this.sessionData.current.id === this.userData.id) {
			switch (tab) {
				case 0:
					/* General: always set */
					break;
				case 1:
					if (!this.dataDefault.list) {
						this.default('default', this.userData.id);
					}
					break;
				case 2:
					if (!this.dataAround.list) {
						this.around('default');
					}
					break;
				case 3:
					if (!this.dataTop.list) {
						this.top('default');
					}
					break;
				case 4:
					if (!this.dataFresh.list) {
						this.fresh('default');
					}
					break;
			}
		}
	}

	// General
	general(user) {
		const data = {
			user: user,
			type: 'general',
			rows: 0,
			cuantity: 0
		};

		this.audioDataService.general(data)
			.subscribe((res: any) => {
				this.dataGeneral.loadingData = false;

				if (!res || res.length === 0) {
					this.dataGeneral.noData = true;
				} else {
					this.dataGeneral.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
					this.dataGeneral.list = res;
				}

				if (!res || res.length < this.env.cuantity) {
					this.dataGeneral.noMore = true;
				}
			}, error => {
				this.dataGeneral.loadingData = false;
				this.alertService.error(this.translations.common.anErrorHasOcurred);
			});
	}

	// Default
	default(type, user) {
		if (type === 'default') {
			this.dataDefault = {
				list: [],
				playlists: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			};

			const data = {
				user: user,
				type: 'default',
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.default(data)
				.subscribe((res: any) => {
					this.dataDefault.loadingData = false;

					if (!res || res.length === 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

						for (const i in res) {
							if (i) {
								this.dataDefault.list.push(res[i]);

								// Push ad
								if (i === (Math.round(res.length * 3 / 5)).toString()) {
									this.dataDefault.list.push(this.pushAd());
								}
							}
						}

						// Check playing item
						// TODO: Hacer una funcion que comprube la cancion que esta sonando si es de esta pantalla
						// if (this.audioPlayerData.type === 'default')
						// 	if ((res.length-1) >= this.audioPlayerData.key)
						// 		this.dataDefault.list[this.audioPlayerData.key] = this.audioPlayerData.item;
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataDefault.noMore = true;
					}
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});

			// Get playlists
			this.audioDataService.defaultPlaylists(data)
				.subscribe((res: any) => {
					this.dataDefault.playlists = res ? res.list : null;
					this.dataDefault.playlistsCount = res ? (res.count > 10) : null;
				});
		} else if (type === 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			const data = {
				user: this.userData.id,
				type: 'default',
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.default(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataDefault.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (const i in res) {
								if (i) {
									this.dataDefault.list.push(res[i]);

									// Push ad
									if (i === (Math.round(res.length * 3 / 5)).toString()) {
										this.dataDefault.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataDefault.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Around
	around(type) {
		if (type === 'default') {
			this.dataAround = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			};

			const data = {
				type: 'around',
				rows: this.dataAround.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.default(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataAround.loadingData = false;

						if (!res || res.length === 0) {
							this.dataAround.noData = true;
						} else {
							this.dataAround.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

							for (const i in res) {
								if (i) {
									this.dataAround.list.push(res[i]);

									// Push ad
									if (i === (Math.round(res.length * 3 / 5)).toString()) {
										this.dataAround.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataAround.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataAround.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataAround.noMore && !this.dataAround.loadingMoreData) {
			this.dataAround.loadingMoreData = true;
			this.dataAround.rows++;

			const data = {
				type: 'around',
				rows: this.dataAround.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.default(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataAround.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataAround.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (const i in res) {
								if (i) {
									this.dataAround.list.push(res[i]);

									// Push ad
									if (i === (Math.round(res.length * 3 / 5)).toString()) {
										this.dataAround.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataAround.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataAround.loadingData = false;
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
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			};

			const data = {
				type: 'top',
				rows: this.dataTop.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.default(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataTop.loadingData = false;

						if (!res || res.length === 0) {
							this.dataTop.noData = true;
						} else {
							this.dataTop.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

							for (const i in res) {
								if (i) {
									this.dataTop.list.push(res[i]);

									// Push ad
									if (i === (Math.round(res.length * 3 / 5)).toString()) {
										this.dataTop.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataTop.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataTop.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});

			// Get playlists
			this.audioDataService.defaultPlaylists(data)
				.subscribe(res => {
					this.dataTop.playlists = res;
				});
		} else if (type === 'more' && !this.dataTop.noMore && !this.dataTop.loadingMoreData) {
			this.dataTop.loadingMoreData = true;
			this.dataTop.rows++;

			const data = {
				type: 'top',
				rows: this.dataTop.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.default(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataTop.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataTop.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (const i in res) {
								if (i) {
									this.dataTop.list.push(res[i]);

									// Push ad
									if (i === (Math.round(res.length * 3 / 5)).toString()) {
										this.dataTop.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataTop.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataTop.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Fresh
	fresh(type) {
		if (type === 'default') {
			this.dataFresh = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			};

			const data = {
				type: 'fresh',
				rows: this.dataFresh.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.default(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataFresh.loadingData = false;

						if (!res || res.length === 0) {
							this.dataFresh.noData = true;
						} else {
							this.dataFresh.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

							for (const i in res) {
								if (i) {
									this.dataFresh.list.push(res[i]);

									// Push ad
									if (i === (Math.round(res.length * 3 / 5)).toString()) {
										this.dataFresh.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataFresh.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataFresh.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataFresh.noMore && !this.dataFresh.loadingMoreData) {
			this.dataFresh.loadingMoreData = true;
			this.dataFresh.rows++;

			const data = {
				type: 'fresh',
				rows: this.dataFresh.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.default(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataFresh.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataFresh.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (const i in res) {
								if (i) {
									this.dataFresh.list.push(res[i]);

									// Push ad
									if (i === (Math.round(res.length * 3 / 5)).toString()) {
										this.dataFresh.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataFresh.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataFresh.loadingData = false;
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
				noMore: false,
				noData: false
			};

			const data = {
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.search(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataSearch.loadingData = false;

						if (!res || res.length === 0) {
							this.dataSearch.noData = true;
						} else {
							this.dataSearch.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

							for (const i in res) {
								if (i) {
									this.dataSearch.list.push(res[i]);

									// Push ad
									if (i === (Math.round(res.length * 3 / 5)).toString()) {
										this.dataSearch.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataSearch.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataSearch.noMore && !this.dataSearch.loadingMoreData) {
			this.dataSearch.loadingMoreData = true;
			this.dataSearch.rows++;

			const data = {
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.search(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataSearch.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataSearch.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (const i in res) {
								if (i) {
									this.dataSearch.list.push(res[i]);

									// Push ad
									if (i === (Math.round(res.length * 3 / 5)).toString()) {
										this.dataSearch.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataSearch.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'clear') {
			this.data.active = 'default';
			this.actionFormSearch.get('caption').setValue('');
		}
	}

	// Upload files
	uploadFiles(type, event) {
		const convertToMb = function (bytes) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
				return '-';
			}

			const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));

			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + ' ' + units[number];
		};

		if (type === 1) { // Add files
			for (const file of event.currentTarget.files) {
				if (file) {
					file.title = file.name.replace('.mp3', '');
					file.status = 'pending';

					if (this.dataFiles.countUploads === 10) {
						this.alertService.error(this.translations.common.exceededMaxUploads);
					} else {
						if (/^audio\/\w+$/.test(file.type)) {
							file.category = 'audio';

							if (file.size >= this.env.maxFileSize) {
								file.sizeBig = convertToMb(file.size);
								file.status = 'error';
							}

							this.dataFiles.list.unshift(file);
						} else {
							file.category = 'unknown';
							file.status = 'error';

							this.dataFiles.list.unshift(file);
						}
					}
				}
			}
		} else if (type === 2) { // Cancel
			this.dataFiles.list = [];
		} else if (type === 3) { // Remove 1 by 1
			this.dataFiles.list.splice(event, 1);
		} else if (type === 4) { // Save & Upload
			if (this.dataFiles.list.length > this.dataFiles.max) {
				this.alertService.success(this.translations.common.addedMoreElementsThanAllowed);
			} else {
				let checkUnknown = _.find(this.dataFiles.list, { 'category': 'unknown' });

				if (checkUnknown) {
					this.alertService.error(this.translations.common.containsInvalidFiles);
				} else {
					this.dataFiles.actions = false;
					const self = this;

					const progressHandler = function (ev, file) {
						file.status = 'progress';
						const percent = Math.round((ev.loaded / ev.total) * 100);
						file.progress = Math.max(0, Math.min(100, percent));
					};

					const counterHandler = function () {
						self.dataFiles.counter = self.dataFiles.counter + 1;
						self.dataFiles.reload = (self.dataFiles.list.length === self.dataFiles.counter) ? true : false;
					};

					const completeHandler = function (ev, file) {
						file.status = 'completed';
						counterHandler();
					};

					const errorHandler = function (ev, file) {
						file.status = 'error';
						counterHandler();
					};

					const abortHandler = function (ev, file) {
						file.status = 'error';
						counterHandler();
					};

					const ajaxCall = function (file, formdata, ajax) {
						formdata.append('fileUpload', file);
						formdata.append('category', file.category);
						formdata.append('title', file.title);

						if (file.explicit) {
							formdata.append('explicit', file.explicit);
						}

						ajax.upload.addEventListener('progress', function (ev) {
							progressHandler(ev, file);
						}, false);

						ajax.addEventListener('load', function (ev) {
							completeHandler(ev, file);
						}, false);

						ajax.addEventListener('error', function (ev) {
							errorHandler(ev, file);
						}, false);

						ajax.addEventListener('abort', function (ev) {
							abortHandler(ev, file);
						}, false);

						ajax.open('POST', './assets/api/audios/uploadFiles.php');
						ajax.setRequestHeader('Authorization', self.sessionData.current.authorization);
						ajax.send(formdata);
					};

					for (const i in this.dataFiles.list) {
						if (i) {
							if (!(this.dataFiles.list[i].category === 'unknown' || this.dataFiles.list[i].sizeBig)) {
								this.dataFiles.list[i].status = 'progress';

								const file = this.dataFiles.list[i],
									formdata = new FormData(),
									ajax = new XMLHttpRequest();

								ajaxCall(file, formdata, ajax);
							}
						}
					}
				}
			}
		} else if (type === 5) { // Reload
			this.data.selectedIndex = 1;
			this.default('default', this.sessionData.current.id);

			this.dataFiles = {
				list: [],
				reload: false,
				actions: true,
				saveDisabled: false,
				counter: 0
			};
		}
	}

	/* // Generate random color
	generateRandomColor() {
		const rand = Math.floor(Math.random() * 40) + 0,
			colorsList = [
				'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
				'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
				'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
				'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
				'linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)',
				'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)',
				'linear-gradient(to right bottom, #a18cd1 0%, #fbc2eb 100%)',
				'linear-gradient(to right bottom, #fbc2eb 0%, #a6c1ee 100%)',
				'linear-gradient(to right bottom, #30cfd0 0%, #330867 100%)',
				'linear-gradient(to right bottom, #5ee7df 0%, #b490ca 100%)',
				'linear-gradient(to right bottom, #cd9cf2 0%, #f6f3ff 100%)',
				'linear-gradient(to right bottom, #37ecba 0%, #72afd3 100%)',
				'linear-gradient(to right bottom, #c471f5 0%, #fa71cd 100%)',
				'linear-gradient(to right bottom, #48c6ef 0%, #6f86d6 100%)',
				'linear-gradient(to right bottom, #ff0844 0%, #ffb199 100%)',
				'linear-gradient(to right bottom, #96fbc4 0%, #f9f586 100%)',
				'linear-gradient(to right bottom, #c71d6f 0%, #d09693 100%)',
				'linear-gradient(to right bottom, #4481eb 0%, #04befe 100%)',
				'linear-gradient(to right bottom, #e8198b 0%, #c7eafd 100%)',
				'linear-gradient(to right bottom, #209cff 0%, #68e0cf 100%)',
				'linear-gradient(to right bottom, #cc208e 0%, #6713d2 100%)',
				'linear-gradient(to right bottom, #b224ef 0%, #7579ff 100%)',
				'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
				'linear-gradient(60deg, #96deda 0%, #50c9c3 100%)',
				'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
				'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
				'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
				'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)',
				'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
				'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
				'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
				'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				'linear-gradient(180deg, #2af598 0%, #009efd 100%)',
				'linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%)',
				'linear-gradient(-60deg, #16a085 0%, #f4d03f 100%)',
				'linear-gradient(-60deg, #ff5858 0%, #f09819 100%)'
				// --> https://webgradients.com/
			];

		return colorsList[rand];
	} */

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

	// Create new playlist
	createPlaylist() {
		const data = {
			type: 'create',
			item: null
		};
		this.sessionService.setDataCreatePlaylist(data);
	}

	// Update playlist
	updatePlaylist(type, data) {
		if (type === 'create') {
			if (this.userData.id === this.sessionData.current.id) {
				this.dataDefault.playlists.unshift(data);
			}

			this.sessionData.current.playlists.unshift(data);
		} else if (type === 'edit') {
			let newPl = [];

			for (let p of this.dataDefault.playlists) {
				if (p.id == data.item.id) {
					newPl.push(data.item);
				} else {
					newPl.push(p);
				}
			}

			this.dataDefault.playlists = newPl;
			console.log('this.dataDefault.playlists:', this.dataDefault.playlists);

			this.sessionData.current.playlists = this.dataDefault.playlists;
		} else if (type === 'addRemoveSession') {
			this.sessionData.current.playlists = this.dataDefault.playlists;
		} else if (type === 'addRemoveUser') {
			if (data.type === 'add') {
				this.sessionData.current.playlists.unshift(data);
			} else {
				for (const i in this.sessionData.current.playlists) {
					if (i) {
						if (this.sessionData.current.playlists[i].id = data.id) {
							this.sessionData.current.playlists[i] = data;
						}
					}
				}
			}
		}

		// Update playslists on selects
		this.sessionData = this.userDataService.setSessionData('update', this.sessionData.current);
		this.sessionService.setDataPlaylists(this.sessionData);
	}

	// Item options
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
					// Set url
					this.location.go(this.router.url);
				});
				break;
			case ('edit'):
				this.location.go('/' + this.userData.username + '/songs#editPlaylist');
				item.path = this.env.pathAudios;
				item.index = index;

				const configEdit = {
					disableClose: false,
					data: {
						type: 'edit',
						sessionData: this.sessionData,
						translations: this.translations,
						item: item
					}
				};

				const dialogRefEdit = this.dialog.open(NewPlaylistComponent, configEdit);
				dialogRefEdit.afterClosed().subscribe((res: any) => {
					this.location.go(this.router.url);
					console.log('afterClosed res:', res);

					if (res) {
						const data = {
							index: res.index,
							item: res
						};

						this.updatePlaylist('edit', data);
					}
				});
				break;
			case ('publicPrivate'):
				item.private = !item.private;
				item.privateType = item.private ? 'private' : 'public';

				const dataPPS = {
					type: item.privateType,
					id: item.id
				};

				this.audioDataService.publicPrivate(dataPPS).subscribe();
				break;
			case ('addRemoveSession'):
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = !item.addRemoveSession ? 'add' : 'remove';
				item.removed = item.addRemoveSession ? true : false;

				const dataARS = {
					type: item.removeType,
					location: 'session',
					id: item.idPlaylist
				};

				this.audioDataService.addRemovePlaylist(dataARS)
					.subscribe((res: any) => {
						this.updatePlaylist('addRemoveSession', null);
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
						this.updatePlaylist('addRemoveUser', item);

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

	// Show genre
	showGenre(item) {
		this.alertService.warning('Genre ' + item.title + ' is not available');
	}

	// See All
	seeAll(type) {
		this.data.content = 'seeAll';

		console.log('type:', type);
		console.log('data:', this.dataGeneral);

		if (
			type === 'hits' ||
			type === 'recommended' ||
			type === 'favourites' ||
			type === 'genres' ||
			type === 'mostPlayed' ||
			type === 'ost' ||
			type === 'top100' ||
			type === 'enjoyWith' ||
			type === 'userPlaylists'
		) {
			this.window.scrollTo(0, 0);

			this.dataSection = {
				type: type,
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false,
				noData: false
			};

			/* Temporalmente hasta que no se haga bien */
			if (type === 'genres') {
				this.dataSection.loadingData = false;
				this.dataSection.noData = false;
				return;
			}

			const data = {
				user: this.userData.id,
				type: this.dataSection.type,
				rows: this.dataSection.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.general(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataSection.loadingData = false;

						if (!res || res.length === 0) {
							this.dataSection.noData = true;
						} else {
							this.dataSection.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

							for (const i in res) {
								if (i) {
									this.dataSection.list.push(res[i]);

									// Push ad
									if (i === '19') {
										this.dataSection.list.push(this.pushAd());
									}
								}
							}
						}

						console.log('this.dataSection:', this.dataSection);

						if (!res || res.length < this.env.cuantity) {
							this.dataSection.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataSection.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more') {
			this.dataSection.loadingMoreData = true;
			this.dataSection.rows++;

			const data = {
				user: this.userData.id,
				type: this.dataSection.type,
				rows: this.dataSection.rows,
				cuantity: this.env.cuantity
			};

			this.audioDataService.general(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataSection.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataSection.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (const i in res) {
								if (i) {
									this.dataSection.list.push(res[i]);

									// Push ad
									if (i === '19') {
										this.dataSection.list.push(this.pushAd());
									}
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataSection.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataSection.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'back') {
			this.data.content = 'default';
		}
	}
}
