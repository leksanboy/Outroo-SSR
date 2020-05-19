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
	selector: 'app-new-share',
	templateUrl: './newShare.component.html',
	providers: [ DateTimePipe, SafeHtmlPipe, TruncatePipe ]
})
export class NewShareComponent implements OnInit, OnDestroy {
	public env: any = environment;
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
	public submitLoading: boolean;
	public searchBoxMentions: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewShareComponent>,
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private alertService: AlertService,
		private followsDataService: FollowsDataService,
		private notificationsDataService: NotificationsDataService
	) {
		this.translations = data.translations;
		this.sessionData = data.sessionData;
		this.data.current = data.item ? data.item : [];
		this.data.users = [];
		this.data.list = [];
		this.data.new = false;

		this.data.active = 'default';

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

		// Get default following users list
		this.defaultUsers();
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
		};

		const data = {
			user: this.sessionData.current.id,
			type: 'following',
			rows: this.dataUsers.rows,
			cuantity: this.env.cuantity
		};

		this.followsDataService.default(data)
			.subscribe((res: any) => {
				this.dataUsers.loadingData = false;

				if (!res) {
					this.dataUsers.noData = true;
				} else {
					this.dataUsers.loadMoreData = res ? (res.length < this.env.cuantity ? false : true) : false;
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
		if (type === 'default') {
			this.data.active = 'search';
			this.dataSearch = {
				list: [],
				rows: 0,
				noData: false,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			};

			const data = {
				user: this.sessionData.current.id,
				caption: this.actionFormSearch.get('caption').value,
				cuantity: this.env.cuantity,
				rows: 0
			};

			this.followsDataService.searchFollowing(data)
				.subscribe((res: any) => {
					this.dataSearch.loadingData = false;

					if (!res || res.length === 0) {
						this.dataSearch.noData = true;
						this.dataSearch.noMore = true;
					} else {
						this.dataSearch.loadMoreData = res ? ((res.length < this.env.cuantity) ? false : true) : false;
						this.dataSearch.noData = false;

						// validate added
						for (const i of res) {
							for (const u of this.data.users) {
								if (i.id === u.user.id) {
									i.added = true;
								}
							}
						}

						this.dataSearch.list = res;

						if (res.length < this.env.cuantity) {
							this.dataSearch.noMore = true;
						}
					}
				});
		} else if (type === 'more' && !this.dataSearch.noMore) {
			this.dataSearch.loadingMoreData = true;
			this.dataSearch.rows++;

			const data = {
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: this.env.cuantity
			};

			this.followsDataService.searchFollowing(data)
				.subscribe((res: any) => {
					this.dataSearch.loadMoreData = res ? ((res.length < this.env.cuantity) ? false : true) : false;
					this.dataSearch.loadingMoreData = false;

					// Push items
					if (!res || res.length > 0) {
						for (const i of res) {
							if (i) {
								this.dataSearch.list.push(i);
							}
						}
					}

					if (res.length < this.env.cuantity) {
						this.dataSearch.noMore = true;
					}
				});
		} else if (type === 'clear') {
			this.data.active = 'default';
			this.actionFormSearch.get('caption').setValue('');
		}
	}

	// Add to new chat
	addUser(item) {
		item.added = !item.added;

		if (!item.added) {
			// Remove from users list and chat list
			for (const i in this.dataUsers.list) {
				if (i) {
					if (this.dataUsers.list[i].id === item.id) {
						this.dataUsers.list[i].added = false;
					}
				}
			}

			// Remove from common list
			for (const i in this.data.users) {
				if (i) {
					if (this.data.users[i].id === item.id) {
						this.data.users.splice(i, 1);
						return false;
					}
				}
			}
		} else {
			this.data.users.push(item);

			// Añadir si el buscado ya es mi amigo
			for (const i in this.dataUsers.list) {
				if (i) {
					if (this.dataUsers.list[i].id === item.id) {
						this.dataUsers.list[i].added = true;
					}
				}
			}
		}

		console.log('this.data.users', this.data.users);
	}

	// Send shared
	submit() {
		if (this.data.users.length > 0) {
			this.submitLoading = true;
			let receivers = [],
				id,
				url;

			for (const user of this.data.users) {
				if (user) {
					receivers.push(user.id);
				}
			}

			console.log('this.data:', this.data);

			if (this.data.comeFrom === 'sharePublication') {
				id = this.data.item.id;
				url = 'publication';
			} else if (this.data.comeFrom === 'shareSong') {
				id = this.data.item.song;
				url = 'audio';
			} else if (this.data.comeFrom === 'sharePlaylist') {
				id = this.data.item.id;
				url = 'playlist';
			} else if (this.data.comeFrom === 'shareUser') {
				id = this.data.item.id;
				url = 'user';
			}

			const data = {
				receivers: receivers,
				url: url,
				id: id
			};

			this.notificationsDataService.share(data)
				.subscribe((res: any) => {
					this.submitLoading = false;

					this.alertService.success(this.translations.common.sentSuccessfully);
					this.close();
				}, error => {
					this.submitLoading = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else {
			this.alertService.success(this.translations.common.addSomeUsers);
		}
	}

	// Close dialog
	close() {
		this.data.close = true;
		this.dialogRef.close(this.data);
	}
}
