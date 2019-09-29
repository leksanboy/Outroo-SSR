import { Location, DOCUMENT } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

import { NewAvatarComponent } from '../../../../app/pages/common/newAvatar/newAvatar.component';

declare var Cropper: any;

@Component({
	selector: 'app-new-playlist',
	templateUrl: './newPlaylist.component.html'
})
export class NewPlaylistComponent implements OnInit {
	@ViewChild('imageSrc') inputImage: ElementRef;

	public sessionData: any = [];
	public translations: any = [];
	public env: any = environment;
	public cropperData: any;
	public flipHrz: boolean;
	public flipVrt: boolean;
	public submitLoading: boolean;
	public actionForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewPlaylistComponent>,
		private sanitizer: DomSanitizer,
		private _fb: FormBuilder,
		public dialog: MatDialog,
		private location: Location,
		private alertService: AlertService,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService
	) {
		console.log('data', data);
		this.sessionData = data.sessionData;
		this.translations = data.translations;
		this.data.current = data.item ? data.item : null;

		if (this.data.type === 'edit') {
			this.actionForm = this._fb.group({
				title: [this.data.current.title, [Validators.required]]
			});
		} else if (this.data.type === 'create') {
			this.actionForm = this._fb.group({
				title: ['', [Validators.required]]
			});
		}
	}

	ngOnInit() {
		// not in use
	}

	// Change avatar
	openImage(action, event) {
		if (action === 'upload') {
			let file = event.target.files[0];

			if (/^image\/\w+$/.test(file.type)) {
				file = URL.createObjectURL(file);
				let image = this.sanitizer.bypassSecurityTrustUrl(file);

				const config = {
					disableClose: false,
					data: {
						sessionData: this.sessionData,
						translations: this.translations,
						image: image,
						comeFrom: 'playlist'
					}
				};

				const dialogRef = this.dialog.open(NewAvatarComponent, config);
				dialogRef.afterClosed().subscribe(res => {
					// New
					this.data.newImage = res;

					// Edit
					if (this.data.current) {
						this.data.current .image = res;
					}

					console.log('data::', this.data);
				});
			} else {
				this.alertService.error(this.translations.common.invalidFile);
			}
		} else if (action === 'remove') {
			this.data.newImage = '';
		}
	}

	submit() {
		switch (this.data.type) {
			case 'create':
				if (this.actionForm.get('title').value.trim().length > 0) {
					this.submitLoading = true;

					const data = {
						type: 'create',
						title: this.actionForm.get('title').value,
						image: this.data.newImage
					};

					this.audioDataService.createPlaylist(data)
						.subscribe((res: any) => {
							this.submitLoading = false;
							this.dialogRef.close(res);
						});
				} else {
					this.alertService.error(this.translations.common.completeAllFields);
				}
				break;
			case 'edit':
				if (this.actionForm.get('title').value.trim().length > 0) {
					this.submitLoading = true;

					let data;
					if (this.data.newImage) {
						data = {
							type: 'update',
							subtype: 'updateNewImage',
							id: this.data.current.id,
							title: this.actionForm.get('title').value,
							color: this.data.current.color,
							image: this.data.newImage
						};
					} else {
						if (this.data.current.image) {
							data = {
								type: 'update',
								subtype: 'updateTitle',
								id: this.data.current.id,
								title: this.actionForm.get('title').value,
								color: this.data.current.color
							};
						} else {
							data = {
								type: 'update',
								subtype: 'updateTitleImage',
								id: this.data.current.id,
								title: this.actionForm.get('title').value,
								color: this.data.current.color
							};
						}
					}

					this.audioDataService.createPlaylist(data)
						.subscribe((res: any) => {
							this.submitLoading = false;
							res.index = this.data.current.index;
							this.dialogRef.close(res);
						});
				} else {
					this.alertService.error(this.translations.common.completeAllFields);
				}
				break;
		}
	}

	close() {
		this.dialogRef.close();
	}
}
