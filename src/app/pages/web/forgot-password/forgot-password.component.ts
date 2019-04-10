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
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html'
})

export class ForgotPasswordComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
	private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public pageStatus = 'default';
	public email: string;
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
	}

	ngOnInit() {
		// Set Google analytics
		if (this.ssrService.isBrowser) {
			let urlGa = 'forgot-password';
			ga('set', 'page', urlGa);
			ga('send', 'pageview');
		}

		// forgot password form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required, Validators.pattern(this.emailPattern)]]
		});

		// destroy session & reset login
		this.userDataService.logout();

		// Get translations
		this.getTranslations(null);
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
			page: data.forgotPassword.title,
			title: data.forgotPassword.title,
			description: data.forgotPassword.description,
			keywords: data.forgotPassword.description,
			url: this.env.url + 'forgot-password',
			image: this.env.url + 'assets/images/image_color.png'
		}

		this.metaService.setData(metaData);
	}

	verifyReCaptcha(data){
		this.recaptcha = data ? true : false;
	}

	submit(ev: Event) {
		this.submitLoading = true;
		this.email = this.actionForm.get('email').value;

		if (this.actionForm.get('email').value.trim().length > 0 && 
			this.recaptcha
		) {
			this.userDataService.forgotPassword(this.actionForm.get('email').value)
				.subscribe(
					res => {
						this.submitLoading = false;

						// show text -> done
						this.pageStatus = 'completed';
					},
					error => {
						this.submitLoading = false;

						// show error message
						this.alertService.error(this.translations.emailNotExist);

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
}
