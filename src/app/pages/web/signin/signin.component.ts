import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html'
})

export class SigninComponent implements OnInit {
	public env: any = environment;
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
		let url = 'signin';
		this.userDataService.analytics(url);
	}

	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});
	}

	goBack(){
		this.router.navigate(['/']);
	}

	verifyReCaptcha(data) {
		this.recaptcha = data ? true : false;
	}

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
