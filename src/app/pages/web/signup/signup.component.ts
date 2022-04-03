import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

declare var global: any;
declare var FB: any;
@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit, AfterViewInit {
	public env: any = environment;
	public window: any = global;
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
		private location: Location,
		private routingStateService: RoutingStateService,
		private sessionService: SessionService,
	) {
		// Get translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Set meta
		const metaData = {
			page: this.translations.signUp.title,
			title: this.translations.signUp.title,
			description: this.translations.signUp.description,
			keywords: this.translations.signUp.description,
			url: this.env.url,
			image: this.env.urlCdn + 'common/images/image_color.png'
		};
		this.metaService.setData(metaData);

		// Destroy session & reset login
		this.userDataService.logout();

		// Set Google analytics
		const url = 'signup';
		const userId = null;
		this.userDataService.analytics(url, this.translations.signUp.title, userId);
	}

	ngOnInit() {
		// Form
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
	}

	ngAfterViewInit() {
		/* this.window.fbAsyncInit = function() {
			this.window['FB'].init({
				appId      : '1158154061233240',
				cookie     : true,
				xfbml      : true,
				version    : 'v7.0'
			});

			this.window['FB'].AppEvents.logPageView();
		};

		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk')); */
	}

	goBack() {
		this.routingStateService.getPreviousUrl();
	}

	verifyReCaptcha(data) {
		this.recaptcha = data ? true : false;
		return this.recaptcha;
	}

	submit(ev: Event) {
		const form = this.actionForm.value;
		this.submitLoading = true;

		if (form.name.trim().length > 0 &&
			form.username.trim().length > 0 &&
			form.password.trim().length > 0 &&
			this.env.emailPattern.test(form.email) &&
			this.recaptcha
		) {
			this.userDataService.createAccount(this.actionForm.value)
				.subscribe(
					res => {
						this.submitLoading = false;

						// show text -> done
						this.pageStatus = 'completed';

						// email
						this.emailAccount = form.email;
					},
					error => {
						this.submitLoading = false;

						// reset reCaptcha
						this.recaptcha = false;
						this.verifyReCaptcha(false);

						// show error message
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					}
				);
		} else {
			this.submitLoading = false;

			// show success message
			this.alertService.error(this.translations.common.completeAllFields);
		}
	}

	signin() {
		const form = this.actionForm.value;
		this.signinLoading = true;

		if (form.name.trim().length > 0 &&
			this.env.emailPattern.test(form.email)
		) {
			let params = {
				type: 'normal',
				username: form.email,
				password: form.password
			};

			this.userDataService.login(params)
				.subscribe(
					res => {
						this.router.navigate(['/']);
					},
					error => {
						this.signinLoading = false;

						this.alertService.error(this.translations.common.anErrorHasOcurred);
					}
				);
		} else {
			this.signinLoading = false;

			this.alertService.error(this.translations.common.incorrectCredentials);
		}
	}

	socialLogin(type) {
		this.sessionService.setSocialLogin(type);
	}
}
