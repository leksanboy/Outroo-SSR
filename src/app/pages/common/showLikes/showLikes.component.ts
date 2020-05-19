import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

declare var global: any;

@Component({
	selector: 'app-show-likes',
	templateUrl: './showLikes.component.html'
})
export class ShowLikesComponent implements OnInit {
	@ViewChild('videoPlayer') videoPlayer: any;
	public window: any = global;
	public env: any = environment;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public dataDefault: any = [];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private alertService: AlertService,
		public dialogRef: MatDialogRef<ShowLikesComponent>,
		private location: Location,
		private sessionService: SessionService,
		private followsDataService: FollowsDataService,
		private publicationsDataService: PublicationsDataService
	) {
		this.translations = data.translations;
		this.sessionData = data.sessionData;

		this.default('default', this.data.item);
	}

	ngOnInit() {
		this.window.scrollTo(0, 0);
	}

	// Follow / Unfollow
	followUnfollow(type, item) {
		if (type === 'follow') {
			item.status = item.private ? 'pending' : 'following';
		} else if (type === 'unfollow') {
			item.status = 'unfollow';
		}

		const data = {
			type: item.status,
			private: item.private,
			receiver: item.user.id
		};

		this.followsDataService.followUnfollow(data).subscribe();
	}

	// Default
	default(type, item) {
		if (type === 'default') {
			this.dataDefault = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noData: false,
				noMore: false,
				service: (this.data.item.comeFrom === 'publication') ? this.publicationsDataService : null
			};

			const data = {
				id: item.id,
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity * 3
			};

			this.dataDefault.service.likes(data)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (!res || res.length === 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataDefault.noData = false;
						this.dataDefault.list = res;
					}

					if (!res || res.length < this.env.cuantity) {
						this.dataDefault.noMore = true;
					}
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			const data = {
				id: this.dataDefault.id,
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity * 3
			};

			this.dataDefault.service.likes(data)
				.subscribe(res => {
					this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
					this.dataDefault.loadingMoreData = false;

					// Push items
					if (!res || res.length > 0) {
						for (const i of res) {
							if (i) {
								this.dataDefault.list.push(i);
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
	}

	// Close
	close() {
		this.dialogRef.close();
	}
}
