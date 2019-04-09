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
	selector: 'app-confirm-email',
	templateUrl: './confirm-email.component.html'
})

export class ConfirmEmailComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public userData: any;
	public pageStatus: string = 'default';

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
		if (this.ssrService.isBrowser) {
			let urlGa = 'confirm-email';
			ga('set', 'page', urlGa);
			ga('send', 'pageview');
		}
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
			page: data.confirmEmail.title,
			title: data.confirmEmail.title,
			description: data.confirmEmail.description,
			keywords: data.confirmEmail.description,
			url: this.env.url + 'confirm-email',
			image: this.env.url + 'assets/images/image_color.png'
		}

		this.metaService.setData(metaData);
	}

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
