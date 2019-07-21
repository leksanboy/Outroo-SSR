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
	selector: 'app-confirm-email',
	templateUrl: './confirm-email.component.html'
})

export class ConfirmEmailComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public userData: any;
	public pageStatus = 'default';

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
			page: this.translations.confirmEmail.title,
			title: this.translations.confirmEmail.title,
			description: this.translations.confirmEmail.description,
			keywords: this.translations.confirmEmail.description,
			url: this.env.url + 'confirm-email',
			image: this.env.url + 'assets/images/image_color.png'
		};
		this.metaService.setData(metaData);

		// Get url data
		const urlData: any = this.activatedRoute.snapshot;
		const data = {
			code: urlData.params.code
		};

		// Validation
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

		// Destroy session & reset login
		this.userDataService.logout();

		// Set Google analytics
		const url = 'confirm-email';
		this.userDataService.analytics(url);
	}

	ngOnInit() {
		// not in use
	}

	// Go back
	goBack() {
		this.routingStateService.getPreviousUrl();
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
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					}
				);
		} else {
			this.submitLoading = false;

			// show error message
			this.alertService.error(this.translations.common.incorrectCredentials);
		}
	}
}
