import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../environments/environment';

import { AlertService } from '../../../../../app/core/services/alert/alert.service';

@Component({
	selector: 'app-add-photos',
	templateUrl: './addPhotos.component.html'
})
export class NewPublicationAddPhotosComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public translations: any;
	public sessionData: any;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewPublicationAddPhotosComponent>,
		private alertService: AlertService,
		private sanitizer: DomSanitizer
	) {
		console.log("Ph constructor");

		this.translations = this.data.translations;
		this.sessionData = this.data.sessionData;
		this.data.list = this.data.list ? this.data.list : [];
		this.data.arrayAddedItems = Object.assign([], (this.data.array ? this.data.array : []));
		this.data.arrayAddedItemsCopy = Object.assign([], (this.data.array ? this.data.array : []));
	}

	ngOnInit() {
		console.log("Ph init");

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
							if (i.up_name) {
								if (i.up_name === e.up_name) {
									i.selected = true;
								}
							}
						}
					}
				}
			}

			this.data.list = this.data.list ? this.data.list : [];
			console.log("this.data", this.data);
		}
	}

	ngOnDestroy() {
		this.submit(null);
	}

	// Select/Unselect
	toggleItem(item) {
		if (item.selected) {
			for (const i in this.data.arrayAddedItems) {
				if (i) {
					if (item.up_name) {
						if (this.data.arrayAddedItems[i].up_name === item.up_name) {
							this.data.arrayAddedItems.splice(i, 1);
						}
					}
				}
			}

			item.selected = false;
		} else {
			this.data.arrayAddedItems.push(item);
			item.selected = true;
		}

		console.log("arrayAddedItems:", this.data.arrayAddedItems);
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
				file.title = file.name;
				file.id = 0;
				file.uploaded = true;
				file.mimetype = file.type;

				if (this.data.countUploads === 10) {
					this.alertService.error(this.translations.common.exceededMaxUploads);
				} else {
					this.data.countUploads++;

					if (/^image\/\w+$/.test(file.type)) {
						file.category = 'image';
						const reader = new FileReader();
						reader.readAsDataURL(file);
						reader.addEventListener('load', function(e) {
							file.thumbnail = e.target;
							file.thumbnail = file.thumbnail.result;
						});

						if (file.size >= 20000000) {
							file.sizeBig = convertToMb(file.size);
							file.status = 'error';
						} else {
							this.uploadFiles(2, file);
						}

						this.data.list.unshift(file);
					} else if (/^video\/\w+$/.test(file.type)) {
						file.category = 'video';
						file.thumbnail = URL.createObjectURL(file);
						file.thumbnail = this.sanitizer.bypassSecurityTrustUrl(file.thumbnail);

						if (file.size >= 20000000) {
							file.sizeBig = convertToMb(file.size);
							file.status = 'error';
						} else {
							this.data.countUploads++;
							this.uploadFiles(2, file);
						}

						this.data.list.unshift(file);
					} else {
						file.status = 'error';
						this.data.list.unshift(file);
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
			array: this.data.arrayAddedItems,
			list: this.data.list,
			countUploads: this.data.countUploads
		};

		this.dialogRef.close(data);
	}

	// Close
	close() {
		const data = {
			array: this.data.arrayAddedItemsCopy,
			list: this.data.list,
			countUploads: this.data.countUploads
		};

		this.dialogRef.close(data);
	}
}
