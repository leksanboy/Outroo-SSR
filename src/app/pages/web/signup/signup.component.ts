import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
	private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private metaService: MetaService,
		private userDataService: UserDataService,
		private ssrService: SsrService,
	) {
		// Get translations
		this.getTranslations(null);
	}

	ngOnInit() {
		// Set Google analytics
		if (this.ssrService.isBrowser) {
			let urlGa = 'signup';
			ga('set', 'page', urlGa);
			ga('send', 'pageview');
		}

		// forgot password form
		this.actionForm = this._fb.group({
			username: ['', [Validators.required]],
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
			password: ['', [Validators.required]],
			lang: [this.userDataService.getCookieLang() || 1]
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
				let regex = /^[a-zA-Z0-9._-]+$/;

				if (val != '' && regex.test(val)) {
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

				if (val != '') {
					if (this.emailPattern.test(val)) {
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

	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
				this.setMetaData(data);
			});
	}

	setMetaData(data) {
		let metaData = {
			page: data.signUp.title,
			title: data.signUp.title,
			description: data.signUp.description,
			keywords: data.signUp.description,
			url: this.env.url + '/',
			image: this.env.url + 'assets/images/image_color.png'
		}

		this.metaService.setData(metaData);
	}

	verifyReCaptcha(data){
		this.recaptcha = data ? true : false;
	}

	submit(ev: Event) {
		this.submitLoading = true;

		if (this.actionForm.get('name').value.trim().length > 0 &&
			this.actionForm.get('username').value.trim().length > 0 &&
			this.actionForm.get('password').value.trim().length > 0 &&
			this.emailPattern.test(this.actionForm.get('email').value) &&
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
			this.emailPattern.test(this.actionForm.get('email').value)
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
