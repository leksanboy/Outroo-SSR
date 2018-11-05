import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../core/services/alert/alert.service';
import { UserDataService } from '../../../core/services/user/userData.service';

@Component({
	selector: 'app-newReport',
	templateUrl: './newReport.component.html'
})
export class NewReportComponent implements OnInit {
	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public actionForm: FormGroup;
	public saveLoading: boolean;
	public inUse: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewReportComponent>,
		private alertService: AlertService,
		private userDataService: UserDataService,
		private _fb: FormBuilder
	) {
		this.sessionData = data.sessionData;
		this.translations = data.translations;
	}

	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			content: ['', [Validators.required]]
		});
	}

	submit(event: Event){
		this.saveLoading = true;

		if (this.actionForm.get('content').value.trim().length > 0) {
			let data = {
				user: this.sessionData.current.id,
				pageId: this.data.item.id,
				pageType: this.data.item.type,
				content: this.actionForm.get('content').value
			};

			this.userDataService.report(data)
				.subscribe(res => {
					this.dialogRef.close(res);
					this.saveLoading = false;
					this.alertService.success(this.translations.sentSuccessfully);
				}, error => {
					this.saveLoading = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else {
			this.saveLoading = false;

			// show error message
			this.alertService.error(this.translations.completeAllFields);
		}
	}

	// Close
	close(){
		this.dialogRef.close();
	}
}
