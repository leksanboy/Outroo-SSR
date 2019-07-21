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
	public submitLoading: boolean;

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

	imageLoad() {
		this.cropperData = new Cropper(this.input.nativeElement, {
			viewMode: 0,
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
	}

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
				const imageBase64 = this.cropperData.getCroppedCanvas({
					width: 320,
					height: 320,
					// fillColor: '#fff',
					imageSmoothingEnabled: false,
					imageSmoothingQuality: 'high'
				}).toDataURL('image/jpeg');

				this.submitLoading = true;

				const d = {
					image: imageBase64
				};

				this.userDataService.updateAvatar(d)
					.subscribe(res => {
						setTimeout(() => {
							this.submitLoading = false;
							this.dialogRef.close(res);
						}, 1000);
					}, error => {
						this.submitLoading = false;
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
		}
	}

	close() {
		this.dialogRef.close();
	}
}
