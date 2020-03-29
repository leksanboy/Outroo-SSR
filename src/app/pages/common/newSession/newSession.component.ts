import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

@Component({
	selector: 'app-new-session',
	templateUrl: './newSession.component.html'
})
export class NewSessionComponent implements OnInit {
	public env: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public inUse: boolean;
	public showPassword: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewSessionComponent>,
		private alertService: AlertService,
		private userDataService: UserDataService,
		private _fb: FormBuilder
	) {
		this.sessionData = data.sessionData;
		this.translations = data.translations;
	}

	ngOnInit() {
		// New session account
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});
	}

	submit() {
		this.inUse = false;

		if (this.actionForm.get('email').value.trim().length > 0 &&
			this.actionForm.get('password').value.trim().length > 0
		) {
			for (let session of this.sessionData.sessions) {
				if (this.actionForm.get('email').value.indexOf('@') !== -1) { // email
					if (this.actionForm.get('email').value === session.email) {
						this.inUse = true;
					}
				} else { // username
					if (this.actionForm.get('email').value === session.username) {
						this.inUse = true;
					}
				}
			}

			if (!this.inUse) {
				this.submitLoading = true;

				this.userDataService.loginNewSession(this.actionForm.get('email').value, this.actionForm.get('password').value)
					.subscribe(res => {
						this.dialogRef.close(res);
						this.submitLoading = false;
					}, error => {
						this.submitLoading = false;
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
			} else {
				this.alertService.error(this.translations.common.accountInUse);
			}
		} else {
			// show error message
			this.alertService.error(this.translations.common.completeAllFields);
		}
	}

	close() {
		this.dialogRef.close();
	}
}
