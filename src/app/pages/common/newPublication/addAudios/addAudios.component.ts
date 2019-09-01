import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

import { AlertService } from '../../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../../app/core/services/user/audioData.service';
import { PlayerService } from '../../../../../app/core/services/player/player.service';

@Component({
	selector: 'app-add-audios',
	templateUrl: './addAudios.component.html'
})
export class NewPublicationAddAudiosComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public sessionData: any;
	public translations: any;
	public audioPlayerData: any = [];
	public dataSearch: any = [];
	public dataDefault: any = [];
	public actionFormSearch: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewPublicationAddAudiosComponent>,
		private _fb: FormBuilder,
		private sanitizer: DomSanitizer,
		private alertService: AlertService,
		private playerService: PlayerService,
		private audioDataService: AudioDataService
	) {
		this.sessionData = this.data.sessionData;
		this.translations = this.data.translations;

		// Search
		this.actionFormSearch = this._fb.group({
			caption: ['']
		});

		// Search/Reset
		this.actionFormSearch.controls['caption'].valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged())
			.subscribe(val => {
				(val.length > 0) ? this.search('default') : this.search('clear');
			});

		// Default
		this.default('default', this.sessionData.current.id);
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.submit(null);
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
				noMore: false,
				noData: false,
				arrayAddedItems: Object.assign([], (this.data.array ? this.data.array : [])),
				arrayAddedItemsCopy: Object.assign([], (this.data.array ? this.data.array : []))
			};

			if (this.data.list) {
				for (const i of this.data.list) {
					if (i) {
						i.selected = false;
					}
				}

				for (const i of this.data.list) {
					if (i) {
						for (const e of this.data.array) {
							if (e) {
								if (i.up_name) {
									if (i.up_name === e.up_name) {
										i.selected = true;
									}
								} else {
									if (i.name === e.name) {
										i.selected = true;
									}
								}
							}
						}
					}
				}

				this.dataDefault.list = this.data.list ? this.data.list : [];
				this.dataDefault.row = this.data.row;
			} else {
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
		} else if (type === 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			const data = {
				user: this.sessionData.current.id,
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

	// Play item song
	playSong(data, item, key, type) {
		if (!this.sessionData) {
			this.alertService.success(this.translations.common.createAnAccountToListenSong);
		} else {
			if (item.id === 0) {
				this.alertService.warning(this.translations.common.songNotUploaded);
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
					this.audioPlayerData.user = this.sessionData.current.id;
					this.audioPlayerData.username = this.sessionData.current.username;
					this.audioPlayerData.location = 'newPublication';
					this.audioPlayerData.type = type;
					this.audioPlayerData.selectedIndex = this.data.selectedIndex;

					this.playerService.setData(this.audioPlayerData);
					item.playing = true;
				}
			}
		}
	}

	// Select/Unselect
	toggleItem(item) {
		if (item.category !== 'unknown') {
			if (item.selected) {
				for (const i in this.dataDefault.arrayAddedItems) {
					if (i) {
						if (item.up_name) {
							if (this.dataDefault.arrayAddedItems[i].up_name === item.up_name) {
								this.dataDefault.arrayAddedItems.splice(i, 1);
							}
						} else {
							if (this.dataDefault.arrayAddedItems[i].name === item.name) {
								this.dataDefault.arrayAddedItems.splice(i, 1);
							}
						}
					}
				}

				item.selected = false;
			} else {
				this.dataDefault.arrayAddedItems.push(item);
				item.selected = true;
			}
		} else {
			this.alertService.error(this.translations.common.invalidFile);
		}
	}

	// Upload files
	uploadFiles(type, event) {
		const convertToMb = function(bytes) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
				return '-';
			}

			const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));

			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) +  ' ' + units[number];
		};

		if (type === 1) { // Add files
			for (const file of event.currentTarget.files) {
				if (file) {
					file.title = file.name.replace('.mp3', '');
					file.uploaded = true;
					file.id = 0;

					if (this.dataDefault.countUploads === 10) {
						this.alertService.error(this.translations.common.exceededMaxUploads);
					} else {
						this.dataDefault.countUploads++;

						if (/^audio\/\w+$/.test(file.type)) {
							file.category = 'audio';

							if (file.size >= 20000000) {
								file.sizeBig = convertToMb(file.size);
								file.status = 'error';
							} else {
								this.uploadFiles(2, file);
							}

							this.dataDefault.list.unshift(file);
						} else {
							file.category = 'unknown';
							file.status = 'error';

							this.dataDefault.list.unshift(file);
						}
					}
				}
			}
		} else if (type === 2) { // Upload one by one
			const self = this;

			const progressHandler = function(ev, fl) {
				fl.status = 'progress';

				const percent = Math.round((ev.loaded / ev.total) * 100);
				fl.progress = Math.max(0, Math.min(100, percent));
			};

			const completeHandler = function(ev, fl) {
				const response = JSON.parse(ev.currentTarget.response);

				fl.status = 'completed';
				fl.up_name = response.name;
				fl.up_type = response.type ? response.type : '';
				fl.original_title = response.original_title ? response.original_title : '';
				fl.up_original_title = response.original_title ? response.original_title : '';
				fl.original_artist = response.original_artist ? response.original_artist : '';
				fl.up_original_artist = response.original_artist ? response.original_artist : '';
				fl.image = response.image ? response.image : '';
				fl.up_image = response.image ? response.image : '';
				fl.up_genre = response.genre ? response.genre : '';
				fl.up_duration = response.duration ? response.duration : '';

				// Add to array
				self.toggleItem(fl);
			};

			const disableHandler = function() {
				self.data.saveDisabled = true;
			};

			const errorHandler = function(ev, fl) {
				fl.status = 'error';
				disableHandler();
				self.toggleItem(fl);
			};

			const abortHandler = function(ev, fl) {
				fl.status = 'error';
				disableHandler();
				self.toggleItem(fl);
			};

			const ajaxCall = function(fl, formdata, ajax) {
				formdata.append('fileUpload', fl);
				formdata.append('category', fl.category);
				formdata.append('title', fl.title);

				ajax.upload.addEventListener('progress', function(ev) {
					progressHandler(ev, fl);
				}, false);

				ajax.addEventListener('load', function(ev) {
					completeHandler(ev, fl);
				}, false);

				ajax.addEventListener('error', function(ev) {
					errorHandler(ev, fl);
				}, false);

				ajax.addEventListener('abort', function(ev) {
					abortHandler(ev, fl);
				}, false);

				ajax.open('POST', './assets/api/publications/uploadFiles.php');
				ajax.setRequestHeader('Authorization', self.sessionData.current.authorization);
				ajax.send(formdata);
			};

			// Call method
			const newFile = event,
			newFormdata = new FormData(),
			newAjax = new XMLHttpRequest();

			ajaxCall(newFile, newFormdata, newAjax);
		}
	}

	// Save
	submit(event) {
		const data = {
			array: this.dataDefault.arrayAddedItems,
			list: this.dataDefault.list,
			rows: this.dataDefault.rows,
			loadMore: this.dataDefault.loadMoreData,
			countUploads: this.dataDefault.countUploads
		};

		this.dialogRef.close(data);
	}

	// Close
	close() {
		const data = {
			array: this.dataDefault.arrayAddedItemsCopy,
			list: this.dataDefault.list,
			rows: this.dataDefault.rows,
			loadMore: this.dataDefault.loadMoreData,
			countUploads: this.dataDefault.countUploads
		};

		this.dialogRef.close(data);
	}
}
