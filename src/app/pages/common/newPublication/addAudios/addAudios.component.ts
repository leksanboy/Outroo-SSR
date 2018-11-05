import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../environments/environment';

import { AudioDataService } from '../../../../../app/core/services/user/audioData.service';

@Component({
	selector: 'app-addAudios',
	templateUrl: './addAudios.component.html'
})
export class NewPublicationAddAudiosComponent implements OnInit {
	public sessionData: any;
	public translations: any;
	public environment: any = environment;
	public noData: boolean;
	public loadingData: boolean;
	public loadMoreData: boolean;
	public loadingMoreData: boolean;
	
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewPublicationAddAudiosComponent>,
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
			for (let i in this.data.list)
				this.data.list[i].selected = false;

			for (let i in this.data.list)
				for (let e in this.data.array)
					if (this.data.list[i].id == this.data.array[e].id)
						this.data.list[i].selected = true;

			this.data.list = this.data.list ? this.data.list : [];
			this.data.rowsDefault = this.data.rows;
			this.loadMoreData = this.data.loadMore;
		} else {
			this.default(this.data.sessionData.current.username);
		}
	}

	// Default
	default(user) {
		this.data.rowsDefault = 0;
		this.loadingData = true;
		this.data.list = [];
		this.noData = false;
		this.loadMoreData = false;
		this.loadingMoreData = false;

		let data = {
			user: user,
			type: 'default',
			rows: this.data.rowsDefault,
			cuantity: environment.cuantity
		}

		this.audioDataService.default(data)
			.subscribe(res => {
				setTimeout(() => {
					this.loadingData = false;

					if (!res || res.length == 0) {
						this.noData = true;
					} else {
						this.loadMoreData = (res.length < environment.cuantity) ? false : true;
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

		let data = {
			user: this.sessionData.current.id,
			type: 'default',
			rows: this.data.rowsDefault,
			cuantity: environment.cuantity
		}

		this.audioDataService.default(data)
			.subscribe(res => {
				setTimeout(() => {
					this.loadMoreData = (res.length < environment.cuantity) ? false : true;
					this.loadingMoreData = false;

					for (let i in res)
						this.data.list.push(res[i]);
				}, 600);
			});
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
	submit(event: Event){
		let data = {
			array: this.data.arrayAddedItems,
			list: this.data.list,
			rows: this.data.rowsDefault,
			loadMore: this.loadMoreData
		}

		this.dialogRef.close(data);
	}

	// Close
	close(){
		let data = {
			array: this.data.arrayAddedItemsCopy,
			list: this.data.list,
			rows: this.data.rowsDefault,
			loadMore: this.loadMoreData
		}

		this.dialogRef.close(data);
	}
}
