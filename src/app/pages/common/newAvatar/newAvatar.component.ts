import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

declare var Cropper: any;

@Component({
	selector: 'app-new-avatar',
	templateUrl: './newAvatar.component.html'
})
export class NewAvatarComponent implements OnInit {
	@ViewChild('imageSrc') input: ElementRef;

	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public cropperData: any;
	public flipHrz: boolean;
	public flipVrt: boolean;
	public saveLoading: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewAvatarComponent>,
		private alertService: AlertService,
		private userDataService: UserDataService
	) {
		this.sessionData = data.sessionData;
		this.translations = data.translations;
	}

	ngOnInit() {
		// no init
	}

	// load image to crop
	imageLoad() {
		if (this.data.comeFrom === 'avatar') {
			this.cropperData = new Cropper(this.input.nativeElement, {
				viewMode: 3,
				aspectRatio: 1 / 1,
				dragMode: 'move',
				modal: true,
				guides: true,
				highlight: true,
				background: true,
				autoCrop: true,
				autoCropArea: 0.7,
				responsive: true
			});
		} else if (this.data.comeFrom === 'background') {
			this.cropperData = new Cropper(this.input.nativeElement, {
				viewMode: 3,
				aspectRatio: 192 / 64,
				dragMode: 'move',
				modal: true,
				guides: true,
				highlight: true,
				background: true,
				autoCrop: true,
				autoCropArea: 0.7,
				responsive: true
			});
		}
	}

	// cropper functions
	cropperFunctions(type) {
		switch (type) {
			case 'zoomIn':
				this.cropperData.zoom(0.1);
				break;
			case 'zoomOut':
				this.cropperData.zoom(-0.1);
				break;
			case 'rotateLeft':
				this.cropperData.rotate(-90);
				break;
			case 'rotateRight':
				this.cropperData.rotate(90);
				break;
			case 'flipHorizontal':
				this.flipHrz = !this.flipHrz;
				this.flipHrz ? this.cropperData.scaleX(-1) : this.cropperData.scaleX(1);
				break;
			case 'flipVertical':
				this.flipVrt = !this.flipVrt;
				this.flipVrt ? this.cropperData.scaleY(-1) : this.cropperData.scaleY(1);
				break;
			case 'close':
				this.dialogRef.close(null);
				break;
			case 'crop':
				if (this.data.comeFrom === 'avatar') {
					const imageBase64 = this.cropperData.getCroppedCanvas({
						width: 320,
						height: 320,
						fillColor: '#fff',
						imageSmoothingEnabled: false,
						imageSmoothingQuality: 'high'
					}).toDataURL('image/jpeg');

					this.saveLoading = true;

					const d = {
						image: imageBase64
					};

					this.userDataService.updateAvatar(d)
						.subscribe(res => {
							setTimeout(() => {
								this.saveLoading = false;
								this.dialogRef.close(res);
							}, 1000);
						}, error => {
							this.saveLoading = false;
							this.alertService.error(this.translations.common.anErrorHasOcurred);
						});
				} else if (this.data.comeFrom === 'background') {
					const imageBase64 = this.cropperData.getCroppedCanvas({
						width: 1920,
						height: 640,
						fillColor: '#fff',
						imageSmoothingEnabled: false,
						imageSmoothingQuality: 'high'
					}).toDataURL('image/jpeg');

					this.saveLoading = true;

					const d = {
						image: imageBase64
					};

					this.userDataService.updateBackground(d)
						.subscribe(res => {
							setTimeout(() => {
								this.saveLoading = false;
								this.dialogRef.close(res);
							}, 1000);
						}, error => {
							this.saveLoading = false;
							this.alertService.error(this.translations.common.anErrorHasOcurred);
						});
				}
				break;
		}
	}

	// Close
	close() {
		this.dialogRef.close();
	}
}
