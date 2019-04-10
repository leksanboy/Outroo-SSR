import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

declare var ga: Function;

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
	private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public signinLoading: boolean;
	public showPassword: boolean;
	public showConfirmPassword: boolean;
	public userData: any = [];
	public pageStatus = 'default';
	public recaptcha: boolean;

	constructor(
		private _fb: FormBuilder,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private alertService: AlertService,
		private metaService: MetaService,
		private userDataService: UserDataService,
		private ssrService: SsrService,
	) {
		// Get translations
		this.getTranslations(null);

		// Get url data
		let urlData: any = this.activatedRoute.snapshot;
		let data = {
			code: urlData.params.code
		}

		this.userDataService.resetPassword(data)
			.subscribe(
				(res: any) => {
					this.userData = res;
					this.userData.code = data.code;
					this.pageStatus = 'default';
				},
				error => {
					this.pageStatus = 'error';
				}
			);
	}

	ngOnInit() {
		// Set Google analytics
		if (this.ssrService.isBrowser) {
			let urlGa = 'reset-password';
			ga('set', 'page', urlGa);
			ga('send', 'pageview');
		}

		// login form
		this.actionForm = this._fb.group({
			password: ['', [Validators.required]],
			confirmPassword: ['', [Validators.required]],
			recaptcha: ['', [Validators.required]]
		});
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
			page: data.resetPassword.title,
			title: data.resetPassword.title,
			description: data.resetPassword.description,
			keywords: data.resetPassword.description,
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

		if (this.actionForm.get('password').value.length > 0 &&
			this.actionForm.get('confirmPassword').value.length > 0 &&
			this.recaptcha
		) {
			if(this.actionForm.get('password').value === this.actionForm.get('confirmPassword').value){
				let data = {
					code: this.userData.code,
					email: this.userData.email,
					username: this.userData.username,
					password: this.actionForm.get('password').value
				};

				this.userDataService.updateResetPassword(data)
					.subscribe(
						res => {
							this.pageStatus = 'completed';
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
				this.alertService.error(this.translations.fieldsNotMatch);
			}
		} else {
			this.submitLoading = false;

			// show error message
			this.alertService.error(this.translations.completeAllFieldsRecaptcha);
		}
	}

	signin(ev: Event) {
		this.signinLoading = true;

		if (this.userData.email.length > 0 &&
			this.actionForm.get('password').value.length > 0) {
			this.userDataService.login(this.userData.email, this.actionForm.get('password').value)
				.subscribe(
					res => {
						this.router.navigate(['/']);
					},
					error => {
						this.signinLoading = false;

						// show error message
						this.alertService.error(this.translations.anErrorHasOcurred);

						// reset recaptcha
						this.recaptcha = false;
					}
				);
		} else {
			this.signinLoading = false;

			// show error message
			this.alertService.error(this.translations.completeAllFieldsRecaptcha);
		}
	}
}
