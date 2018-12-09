import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

declare var ga: Function;

@Component({
	selector: 'app-confirm-email',
	templateUrl: './confirm-email.component.html'
})

export class ConfirmEmailComponent implements OnInit {
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public userData: any;
	public pageStatus: string = 'default';
	public translations: any = [];

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private userDataService: UserDataService
	) {
		// Get translations
		this.getTranslations(1);

		// Get url data
		let urlData: any = this.activatedRoute.snapshot;
		let data = {
			code: urlData.params.code
		}

		this.userDataService.confirmEmail(data)
			.subscribe(
				res => {
					setTimeout(() => {
						this.userData = res;
						this.pageStatus = 'completed';
					}, 600);
				},
				error => {
					setTimeout(() => {
						this.pageStatus = 'error';
					}, 600);
				}
			);
	}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'confirm-email';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');

		// Set page title
		this.titleService.setTitle('Confirm email');

		// Get translations
		this.getTranslations(1);
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Submit
	submit() {
		this.submitLoading = true;

		if (this.userData.email.length > 0 && this.userData.password.length > 0) {
			this.userDataService.login(this.userData.email, this.userData.password)
				.subscribe(
					res => {
						this.router.navigate(['/']);
					},
					error => {
						this.submitLoading = false;

						// show error message
						this.alertService.error(this.translations.anErrorHasOcurred);
					}
				);
		} else {
			this.submitLoading = false;

			// show error message
			this.alertService.error(this.translations.incorrectCredentials);
		}
	}
}
