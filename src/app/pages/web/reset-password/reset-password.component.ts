import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
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
		private activatedRoute: ActivatedRoute,
		private alertService: AlertService,
		private metaService: MetaService,
		private router: Router,
		private ssrService: SsrService,
		private userDataService: UserDataService,
		private routingStateService: RoutingStateService,
	) {
		// Get translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Set meta
		const metaData = {
			page: this.translations.resetPassword.title,
			title: this.translations.resetPassword.title,
			description: this.translations.resetPassword.description,
			keywords: this.translations.resetPassword.description,
			url: this.env.url,
			image: this.env.urlCdn + 'common/images/image_color.png'
		};
		this.metaService.setData(metaData);

		// Get url data
		const urlData: any = this.activatedRoute.snapshot;
		const data = {
			code: urlData.params.code
		};

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

		// Destroy session & reset login
		this.userDataService.logout();

		// Set Google analytics
		const url = 'reset-password';
		const userId = null;
		this.userDataService.analytics(url, this.translations.resetPassword.title, userId);
	}

	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			password: ['', [Validators.required]],
			confirmPassword: ['', [Validators.required]],
			recaptcha: ['', [Validators.required]],
			lang: [this.userDataService.getLang('get', null) || 1]
		});
	}

	goBack() {
		this.routingStateService.getPreviousUrl();
	}

	verifyReCaptcha(data) {
		this.recaptcha = data ? true : false;
	}

	submit(ev: Event) {
		const form = this.actionForm.value;
		this.submitLoading = true;

		if (form.password.length > 0 &&
			form.confirmPassword.length > 0 &&
			this.recaptcha
		) {
			if (form.password === form.confirmPassword) {
				const data = {
					code: this.userData.code,
					email: this.userData.email,
					username: this.userData.username,
					password: form.password,
					lang: form.lang
				};


				this.userDataService.updateResetPassword(data)
					.subscribe(
						res => {
							this.pageStatus = 'completed';
						},
						error => {
							this.submitLoading = false;

							// show error message
							this.alertService.error(this.translations.common.anErrorHasOcurred);

							// reset reCaptcha
							this.recaptcha = false;
						}
					);
			} else {
				this.submitLoading = false;
				this.alertService.error(this.translations.common.fieldsNotMatch);
			}
		} else {
			this.submitLoading = false;

			// show error message
			this.alertService.error(this.translations.common.completeAllFields);
		}
	}

	signin(ev: Event) {
		const form = this.actionForm.value;
		this.signinLoading = true;

		if (this.userData.email.length > 0 && form.password.length > 0) {
			let params = {
				type: 'normal',
				username: this.userData.email,
				password: form.password
			};

			this.userDataService.login(params)
				.subscribe(
					res => {
						this.router.navigate(['/']);
					},
					error => {
						this.signinLoading = false;

						// show error message
						this.alertService.error(this.translations.common.anErrorHasOcurred);

						// reset recaptcha
						this.recaptcha = false;
					}
				);
		} else {
			this.signinLoading = false;

			// show error message
			this.alertService.error(this.translations.common.completeAllFields);
		}
	}
}
