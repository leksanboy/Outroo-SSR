import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipsModule } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { AlertService } from '../../../../app/core/services/alert/alert.service';

import { DateTimePipe } from '../../../../app/core/pipes/datetime.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';
import { TruncatePipe } from '../../../../app/core/pipes/truncate.pipe';

declare var global: any;

@Component({
	selector: 'app-showShare',
	templateUrl: './showShare.component.html',
	providers: [ DateTimePipe, SafeHtmlPipe, TruncatePipe ]
})
export class ShowShareComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public translations: any = [];
	public sessionData: any = [];
	public actionFormSearch: FormGroup;
	public dataUsers: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public dataSearch: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public showUsers: boolean;
	public saveLoading: boolean;
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ShowShareComponent>,
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private alertService: AlertService,
		private followsDataService: FollowsDataService,
		private notificationsDataService: NotificationsDataService
	) {
		console.log("data", data);

		this.translations = data.translations;
		this.sessionData = data.sessionData;
		this.data.current = data.item ? data.item : [];
		this.data.users = [];
		this.data.list = [];
		this.data.new = false;

		if (this.data.comeFrom == 'sharePhoto' || 
			this.data.comeFrom == 'sharePublication' || 
			this.data.comeFrom == 'shareSong'
		){
			this.data.active = 'default';

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

			// Get default following users list
			this.defaultUsers();
		}
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.close();
	}

	// Default users
	defaultUsers() {
		this.dataUsers = {
			list: [],
			rows: 0,
			noData: false,
			loadingData: true,
			loadMoreData: false,
			loadingMoreData: false
		}

		let data = {
			user: this.sessionData.current.username,
			session: this.sessionData.current.id,
			type: 'following',
			rows: this.dataUsers.rows,
			cuantity: environment.cuantity
		}

		this.followsDataService.default(data)
			.subscribe(res => {
				this.dataUsers.loadingData = false;

				if (res.length == 0) {
					this.dataUsers.noData = true;
				} else {
					res.length < environment.cuantity ? this.dataUsers.loadMoreData = false : this.dataUsers.loadMoreData = true;
					this.dataUsers.noData = false;
					this.dataUsers.list = res;
				}
			}, error => {
				this.dataUsers.loadingData = false;
				this.alertService.error(this.translations.common.anErrorHasOcurred);
			});
	}

	// Search
	search(type) {
		if (type == 'default') {
			this.data.active = 'search';
			this.dataSearch = {
				list: [],
				rows: 0,
				noData: false,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			}

			let data = {
				session: this.sessionData.current.id,
				user: this.sessionData.current.id,
				caption: this.actionFormSearch.get('caption').value,
				cuantity: environment.cuantity
			}

			this.followsDataService.searchFollowing(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadingData = false;

						if (!res || res.length == 0) {
							this.dataSearch.noData = true;
							this.dataSearch.noMore = true;
						} else {
							this.dataSearch.loadMoreData = (res.length < environment.cuantity) ? false : true;
							this.dataSearch.noData = false;
							
							// validate added
							for(let i in res)
								for(let u in this.data.users)
									if (res[i].id == this.data.users[u].user.id)
										res[i].added = true;

							this.dataSearch.list = res;

							if (res.length < environment.cuantity)
								this.dataSearch.noMore = true;
						}
					}, 600);
				});
		} else if (type == 'more' && !this.dataSearch.noMore) {
			this.dataSearch.loadingMoreData = true;
			this.dataSearch.rows++;

			let data = {
				session: this.sessionData.current.id,
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: environment.cuantity
			}

			this.followsDataService.searchFollowing(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataSearch.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								this.dataSearch.list.push(res[i]);

						if (res.length < environment.cuantity)
							this.dataSearch.noMore = true;
					}, 600);
				});
		} else if (type == 'clear') {
			this.data.active = 'default';
			this.actionFormSearch.get('caption').setValue('');
		}
	}

	// Add to new chat
	addUser(item) {
		item.added = !item.added;

		if (!item.added) {
			// Remove from users list and chat list
			for (let i in this.dataUsers.list)
				if (this.dataUsers.list[i].id == item.id)
					this.dataUsers.list[i].added = false;
			

			// Remove from common list
			for (let i in this.data.users) {
				if (this.data.users[i].id == item.id) {
					this.data.users.splice(i, 1);
					return false;
				}
			}
		} else {
			this.data.users.push(item);
		}
	}

	// Send shared
	sendShared() {
		let users = [];
		for (let user of this.data.users) {
			users.push(user.id);
		}

		if (this.data.users.length > 0) {
			let id, url

			if (this.data.comeFrom == 'sharePhoto') {
				id = this.data.item.id;
				url = 'photos';
			} else if (this.data.comeFrom == 'sharePublication') {
				id = this.data.item.id;
				url = 'publications';
			} else if (this.data.comeFrom == 'shareSong') {
				id = this.data.item.song;
				url = 'audios';
			}

			let data = {
				sender: this.sessionData.current.id,
				receivers: users,
				url: url,
				id: id
			};

			this.notificationsDataService.share(data)
				.subscribe((res: any) => {
					this.saveLoading = false;
				}, error => {
					this.saveLoading = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}

		this.alertService.success(this.translations.common.sentSuccessfully);
		this.close();
	}

	// Close dialog
	close() {
		this.data.close = true;
		this.dialogRef.close(this.data);
	}
}
