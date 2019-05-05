import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

declare var ga: Function;

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public signinLoading: boolean;
	public pageStatus = 'default';
	public showPassword: boolean;
	public validatorUsername: string;
	public validatorEmail: string;
	public emailAccount: string;
	public recaptcha: boolean;

	constructor(
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private alertService: AlertService,
		private metaService: MetaService,
		private router: Router,
		private ssrService: SsrService,
		private userDataService: UserDataService,
	) {
		// Get translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Set meta
		const metaData = {
			page: this.translations.signUp.title,
			title: this.translations.signUp.title,
			description: this.translations.signUp.description,
			keywords: this.translations.signUp.description,
			url: this.env.url + '/',
			image: this.env.url + 'assets/images/image_color.png'
		};
		this.metaService.setData(metaData);
	}

	ngOnInit() {
		// Set Google analytics
		if (this.ssrService.isBrowser) {
			const urlGa = 'signup';
			ga('set', 'page', urlGa);
			ga('send', 'pageview');
		}

		// forgot password form
		this.actionForm = this._fb.group({
			username: ['', [Validators.required]],
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.pattern(this.env.emailPattern)]],
			password: ['', [Validators.required]],
			lang: [this.userDataService.getLang('get', null) || 1]
		});

		// Validate username
		this.actionForm.get('username').valueChanges
			.subscribe(val => {
				this.actionForm.controls['username'].setErrors({ validate: false });
			});

		this.actionForm.get('username').valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged())
			.subscribe(val => {
				this.validatorUsername = 'load';
				const regex = /^[a-zA-Z0-9._-]+$/;

				if (val !== '' && regex.test(val)) {
					this.userDataService.checkUsername(val)
						.subscribe(res => {
							setTimeout(() => {
								if (res) {
									this.actionForm.controls['username'].setErrors({ validate: false });
									this.validatorUsername = 'bad';
								} else {
									this.actionForm.controls['username'].setErrors(null);
									this.validatorUsername = 'done';
								}
							}, 600);
						});
				} else {
					this.actionForm.controls['username'].setErrors({ validate: false });
					this.validatorUsername = 'bad';
				}
			});

		// Validate email
		this.actionForm.get('email').valueChanges
			.subscribe(val => {
				this.actionForm.controls['email'].setErrors({ validate: false });
			});

		this.actionForm.get('email').valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged())
			.subscribe(val => {
				this.validatorEmail = 'load';

				if (val !== '') {
					if (this.env.emailPattern.test(val)) {
						this.userDataService.checkEmail(this.actionForm.get('email').value)
							.subscribe(
								res => {
									setTimeout(() => {
										if (res) {
											this.actionForm.controls['email'].setErrors({ validate: false });
											this.validatorEmail = 'bad';
										} else {
											this.actionForm.controls['email'].setErrors(null);
											this.validatorEmail = 'done';
										}
									}, 1000);
								},
								error => {
									this.actionForm.controls['email'].setErrors({ validate: false });
									this.validatorEmail = 'bad';
								}
							);
					} else {
						this.actionForm.controls['email'].setErrors({ validate: false });
						this.validatorEmail = 'bad';
					}
				} else {
					this.actionForm.controls['email'].setErrors({ validate: false });
					this.validatorEmail = 'bad';
				}
			});

		// destroy session & reset login
		this.userDataService.logout();
	}

	goBack(){
		this.router.navigate(['/']);
	}

	verifyReCaptcha(data) {
		this.recaptcha = data ? true : false;
	}

	submit(ev: Event) {
		this.submitLoading = true;

		if (this.actionForm.get('name').value.trim().length > 0 &&
			this.actionForm.get('username').value.trim().length > 0 &&
			this.actionForm.get('password').value.trim().length > 0 &&
			this.env.emailPattern.test(this.actionForm.get('email').value) &&
			this.recaptcha
		) {
			this.userDataService.createAccount(this.actionForm.value)
				.subscribe(
					res => {
						this.submitLoading = false;

						// show text -> done
						this.pageStatus = 'completed';

						// email
						this.emailAccount = this.actionForm.get('email').value;
					},
					error => {
						this.submitLoading = false;

						// show error message
						this.alertService.error(this.translations.anErrorHasOcurred);

						// reset reCaptcha
						this.recaptcha = false;
					}
				);
		} else {
			this.submitLoading = false;

			// show success message
			this.alertService.error(this.translations.completeAllFieldsRecaptcha);
		}
	}

	signin() {
		this.signinLoading = true;

		if (this.actionForm.get('name').value.trim().length > 0 &&
			this.env.emailPattern.test(this.actionForm.get('email').value)
		) {
			this.userDataService.login(this.actionForm.get('email').value, this.actionForm.get('password').value)
				.subscribe(
					res => {
						this.router.navigate(['/']);
					},
					error => {
						this.signinLoading = false;

						// show error message
						this.alertService.error(this.translations.anErrorHasOcurred);
					}
				);
		} else {
			this.signinLoading = false;

			// show error message
			this.alertService.error(this.translations.incorrectCredentials);
		}
	}
}
