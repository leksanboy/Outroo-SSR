import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../environments/environment';

import { AudioDataService } from '../../../../../app/core/services/user/audioData.service';

@Component({
	selector: 'app-add-audios',
	templateUrl: './addAudios.component.html'
})
export class NewPublicationAddAudiosComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public sessionData: any;
	public translations: any;
	public noData: boolean;
	public loadingData: boolean;
	public loadMoreData: boolean;
	public loadingMoreData: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewPublicationAddAudiosComponent>,
		private sanitizer: DomSanitizer,
		private audioDataService: AudioDataService
	) { }

	ngOnInit() {
		this.sessionData = this.data.sessionData;
		this.translations = this.data.translations;
		this.data.rowsDefault = 0;
		this.data.list = this.data.list ? this.data.list : [];
		this.data.arrayAddedItems = [];
		this.data.arrayAddedItems = Object.assign([], this.data.array);
		this.data.arrayAddedItemsCopy = [];
		this.data.arrayAddedItemsCopy = Object.assign([], this.data.array);

		if (this.data.list.length > 0) {
			for (const i of this.data.list) {
				if (i) {
					i.selected = false;
				}
			}

			for (const i of this.data.list) {
				if (i) {
					for (const e of this.data.array) {
						if (e) {
							if (i.id === e.id) {
								i.selected = true;
							}
						}
					}
				}
			}

			this.data.list = this.data.list ? this.data.list : [];
			this.data.rowsDefault = this.data.rows;
			this.loadMoreData = this.data.loadMore;
		} else {
			this.default(this.data.sessionData.current.username);
		}
	}

	ngOnDestroy() {
		this.submit(null);
	}

	// Default
	default(user) {
		this.data.rowsDefault = 0;
		this.loadingData = true;
		this.data.list = [];
		this.noData = false;
		this.loadMoreData = false;
		this.loadingMoreData = false;

		const data = {
			user: user,
			type: 'default',
			rows: this.data.rowsDefault,
			cuantity: this.env.cuantity
		};

		this.audioDataService.default(data)
			.subscribe((res: any) => {
				setTimeout(() => {
					this.loadingData = false;

					if (!res || res.length === 0) {
						this.noData = true;
					} else {
						this.loadMoreData = (res.length < this.env.cuantity) ? false : true;
						this.noData = false;
						this.data.list = res;
					}
				}, 600);
			});
	}

	// Load more
	loadMore() {
		this.loadingMoreData = true;
		this.data.rowsDefault++;

		const data = {
			type: 'default',
			rows: this.data.rowsDefault,
			cuantity: this.env.cuantity
		};

		this.audioDataService.default(data)
			.subscribe((res: any) => {
				setTimeout(() => {
					this.loadMoreData = (res.length < this.env.cuantity) ? false : true;
					this.loadingMoreData = false;

					for (const i of res) {
						if (i) {
							this.data.list.push(i);
						}
					}
				}, 600);
			});
	}

	// Select/unselect
	toggleItem(item) {
		if (item.selected) {
			for (const i in this.data.arrayAddedItems) {
				if (i) {
					if (this.data.arrayAddedItems[i].id === item.id) {
						this.data.arrayAddedItems.splice(i, 1);
					}
				}
			}

			item.selected = false;
		} else {
			this.data.arrayAddedItems.push(item);
			item.selected = true;
		}
	}

	// Save
	submit(event) {
		const data = {
			array: this.data.arrayAddedItems,
			list: this.data.list,
			rows: this.data.rowsDefault,
			loadMore: this.loadMoreData
		};

		this.dialogRef.close(data);
	}

	// Close
	close() {
		const data = {
			array: this.data.arrayAddedItemsCopy,
			list: this.data.list,
			rows: this.data.rowsDefault,
			loadMore: this.loadMoreData
		};

		this.dialogRef.close(data);
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
			for (let i = 0; i < event.currentTarget.files.length; i++) {
				const file = event.currentTarget.files[i];
				file.title = file.name.replace('.mp3', '');
				file.id = '000' + this.data.counterUploaded++;
				file.uploaded = true;

				if (/^audio\/\w+$/.test(file.type)) {
					file.category = 'audio';

					if (file.size >= 20000000) {
						file.sizeBig = convertToMb(file.size);
						file.status = 'error';
					} else {
						this.uploadFiles(2, file);
					}

					this.data.list.push(file);
				} else {
					file.status = 'error';
					this.data.list.unshift(file);
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
				fl.up_original_title = response.original_title ? response.original_title : '';
				fl.up_original_artist = response.original_artist ? response.original_artist : '';
				fl.up_genre = response.genre ? response.genre : '';
				fl.up_image = response.image ? response.image : '';
				fl.up_duration = response.duration ? response.duration : '';

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
				ajax.send(formdata);
			};

			// Call method
			const newFile = event,
			newFormdata = new FormData(),
			newAjax = new XMLHttpRequest();

			ajaxCall(newFile, newFormdata, newAjax);
		}
	}
}
