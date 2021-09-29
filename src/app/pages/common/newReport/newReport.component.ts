import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../core/services/alert/alert.service';
import { UserDataService } from '../../../core/services/user/userData.service';

@Component({
	selector: 'app-new-report',
	templateUrl: './newReport.component.html'
})
export class NewReportComponent implements OnInit {
	public env: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public inUse: boolean;
	public types: any = [];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewReportComponent>,
		private alertService: AlertService,
		private userDataService: UserDataService,
		private _fb: FormBuilder
	) {
		this.sessionData = data.sessionData;
		this.translations = data.translations;

		this.types = [
			{
				value: 'violence',
				content: this.translations.common.reportTypes.violence
			}, {
				value: 'hate',
				content: this.translations.common.reportTypes.hate
			}, {
				value: 'rights',
				content: this.translations.common.reportTypes.rights
			}, {
				value: 'spam',
				content: this.translations.common.reportTypes.spam
			}, {
				value: 'other',
				content: this.translations.common.reportTypes.other
			}
		];

		console.log('this.types:', this.types);
	}

	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			type: ['', [Validators.required]],
			content: [''],
			lang: [this.userDataService.getLang('get', null) || 1]
		});
	}

	submit() {
		const form = this.actionForm.value;
		this.submitLoading = true;

		if (form.type.trim().length > 0) {
			if (form.type.trim().length <= 2000) {
				const data = {
					pageId: this.data.item.id,
					pageType: this.data.item.type,
					type: form.type,
					typeText: this.types.filter(i => i.value == form.type)[0].content,
					content: form.content,
					lang: form.lang
				};

				this.userDataService.report(data)
					.subscribe(
						res => {
							this.dialogRef.close(res);
							this.submitLoading = false;
							this.alertService.success(this.translations.common.sentSuccessfully);
						}, error => {
							this.submitLoading = false;
							this.alertService.error(this.translations.common.anErrorHasOcurred);
						}
					);
			} else {
				this.alertService.error(this.translations.common.isTooLong);
			}
		} else {
			this.submitLoading = false;
			this.alertService.error(this.translations.common.chooseOption);
		}
	}

	close() {
		this.dialogRef.close();
	}
}
