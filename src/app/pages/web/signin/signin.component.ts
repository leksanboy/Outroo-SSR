import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

declare var global: any;
@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html'
})

export class SigninComponent implements OnInit {
	public env: any = environment;
	public window: any = global;
	public translations: any = [];
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public showPassword: boolean;
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
	) {
		// Get translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Set meta
		const metaData = {
			page: this.translations.signIn.title,
			title: this.translations.signIn.title,
			description: this.translations.signIn.description,
			keywords: this.translations.signIn.description,
			url: this.env.url + '/',
			image: this.env.url + 'assets/images/image_color.png'
		};
		this.metaService.setData(metaData);

		// Destroy session & reset login
		this.userDataService.logout();

		// Set Google analytics
		const url = 'signin';
		const userId = null;
		this.userDataService.analytics(url, this.translations.signIn.title, userId);
	}

	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
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

		if (form.email.trim().length > 0 && form.password.trim().length > 0) {
			let params = {
				type: 'normal',
				username: form.email,
				password: form.password
			};

			this.userDataService.login(params)
				.subscribe(
					res => {
						let url = this.routingStateService.getUrlBeforeLogin();
						this.window.location.href = url;
					},
					error => {
						this.submitLoading = false;
						this.recaptcha = false;

						// show error message
						this.alertService.error(this.translations.common.emailOrPasswordIncorrect);
					}
				);
		} else {
			this.submitLoading = false;
			this.alertService.error(this.translations.common.completeAllFields);
		}
	}
}
