import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

declare var ga: Function;

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html'
})

export class SigninComponent implements OnInit {
	public environment: any = environment;
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public showPassword: boolean;
	public recaptcha: boolean;
	public translations: any = [];

	constructor(
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private titleService: Title,
		private alertService: AlertService,
		private userDataService: UserDataService
	) {
		// Get translations
		this.getTranslations(1);
	}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'signin';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');

		// Set page title
		this.titleService.setTitle('Sign In | Login');

		// login form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});

		// destroy session & reset login
		this.userDataService.logout();
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Verify recaptcha
	verifyReCaptcha(data){
		this.recaptcha = data ? true : false;
	}

	// Submit
	submit(ev: Event) {
		this.submitLoading = true;

		if (this.actionForm.get('email').value.trim().length > 0 &&
			this.actionForm.get('password').value.trim().length > 0 &&
			this.recaptcha
		) {
			this.userDataService.login(this.actionForm.get('email').value, this.actionForm.get('password').value)
				.subscribe(
					(res: any) => {
						this.router.navigate([res.username]);
					},
					error => {
						this.submitLoading = false;

						// show error message
						this.alertService.error(this.translations.emailOrPasswordIncorrect);

						// reset reCaptcha
						this.recaptcha = false;
					}
				);
		} else {
			this.submitLoading = false;

			// show error message
			this.alertService.error(this.translations.completeAllFieldsRecaptcha);
		}
	}
}
