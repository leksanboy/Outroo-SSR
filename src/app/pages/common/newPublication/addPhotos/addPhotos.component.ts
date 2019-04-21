import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../environments/environment';

import { PhotoDataService } from '../../../../../app/core/services/user/photoData.service';

@Component({
	selector: 'app-addPhotos',
	templateUrl: './addPhotos.component.html'
})
export class NewPublicationAddPhotosComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public translations: any;
	public sessionData: any;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewPublicationAddPhotosComponent>,
		private sanitizer: DomSanitizer,
		private photoDataService: PhotoDataService
	) { }

	ngOnInit() {
		this.translations = this.data.translations;
		this.sessionData = this.data.sessionData;

		this.data.list = this.data.list ? this.data.list : [];
		this.data.arrayAddedItems = [];
		this.data.arrayAddedItems = Object.assign([], this.data.array);
		this.data.arrayAddedItemsCopy = [];
		this.data.arrayAddedItemsCopy = Object.assign([], this.data.array);

		if (this.data.list.length > 0) {
			for (let i in this.data.list)
				this.data.list[i].selected = false;

			for (let i in this.data.list)
				for (let e in this.data.array)
					if (this.data.list[i].id == this.data.array[e].id)
						this.data.list[i].selected = true;

			this.data.list = this.data.list ? this.data.list : [];
		}
	}

	ngOnDestroy() {
		this.submit(null);
	}

	// Select/unselect
	toggleItem(item){
		if (item.selected) {
			for (let i in this.data.arrayAddedItems)
				if (this.data.arrayAddedItems[i].id == item.id)
					this.data.arrayAddedItems.splice(i, 1);

			item.selected = false;
		} else {
			this.data.arrayAddedItems.push(item);
			item.selected = true;
		}
	}

	// Save
	submit(event){
		let data = {
			array: this.data.arrayAddedItems,
			list: this.data.list
		}

		this.dialogRef.close(data);
	}

	// Close
	close(){
		let data = {
			array: this.data.arrayAddedItemsCopy,
			list: this.data.list
		}

		this.dialogRef.close(data);
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
			for (let i = 0; i < event.currentTarget.files.length; i++) {
				let file = event.currentTarget.files[i];
				file.title = file.name;
				file.user = this.sessionData.current.id;
				file.id = '000' + this.data.counterUploaded++;
				file.uploaded = true;
				file.mimetype = file.type;

				if (/^image\/\w+$/.test(file.type)) {
					file.category = 'image';
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.addEventListener("load", function(e) {
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
						this.uploadFiles(2, file);
					}

					this.data.list.unshift(file);
				} else {
					file.status = 'error';
					this.data.list.unshift(file);
				}
			}
		} else if (type == 2) { // Upload one by one
			let self = this;

			const ajaxCall = function(file, formdata, ajax){
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

				ajax.open("POST", "./assets/api/publications/uploadFiles.php");
				ajax.send(formdata);
			}

			const progressHandler = function(event, file) {
				file.status = 'progress';

				let percent = Math.round((event.loaded / event.total) * 100);
				file.progress = Math.max(0, Math.min(100, percent));
			}

			const completeHandler = function(event, file) {
				let response = JSON.parse(event.currentTarget.response);

				file.status = 'completed';
				file.up_name = response.name;
				file.up_type = response.type ? response.type : '';
				file.up_original_title = response.original_title ? response.original_title : '';
				file.up_original_artist = response.original_artist ? response.original_artist : '';
				file.up_genre = response.genre ? response.genre : '';
				file.up_image = response.image ? response.image : '';
				file.up_duration = response.duration ? response.duration : '';

				self.toggleItem(file);
			}

			const errorHandler = function(event, file) {
				file.status = 'error';
				disableHandler();
				self.toggleItem(file);
			}

			const abortHandler = function(event, file) {
				file.status = 'error';
				disableHandler();
				self.toggleItem(file);
			}

			const disableHandler = function(){
				self.data.saveDisabled = true;
			}

			// Call method
			let file = event,
				formdata = new FormData(),
				ajax = new XMLHttpRequest();

			ajaxCall(file, formdata, ajax);
		}
	}
}
