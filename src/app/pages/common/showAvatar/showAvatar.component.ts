import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-showAvatar',
	templateUrl: './showAvatar.component.html'
})
export class ShowAvatarComponent {
	public environment: any = environment;
	public userData: any = [];
	public translations: any = [];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ShowAvatarComponent>
	) {
		this.userData = data.userData;
		this.translations = data.translations;
	}

	// Close
	close(){
		this.dialogRef.close();
	}
}
