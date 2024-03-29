import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

@Component({
	selector: 'app-support',
	templateUrl: './support.component.html'
})

export class SupportComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public pageStatus = 'default';
	public email: string;
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
			page: this.translations.support.title,
			title: this.translations.support.title,
			description: this.translations.support.description,
			keywords: this.translations.support.description,
			url: this.env.url,
			image: this.env.urlCdn + 'common/images/image_color.png'
		};
		this.metaService.setData(metaData);

		// Set Google analytics
		const url = 'support';
		const userId = null;
		this.userDataService.analytics(url, this.translations.support.title, userId);
	}

	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required, Validators.pattern(this.env.emailPattern)]],
			content: ['', [Validators.required]],
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

		// For html to say to who
		this.email = form.email.trim();

		if (this.env.emailPattern.test(form.email.trim()) &&
			form.email.trim().length > 0 &&
			this.recaptcha
		) {
			const data = {
				email: form.email.trim(),
				content: form.content,
				lang: form.lang
			};

			this.userDataService.supportQuestion(data)
				.subscribe(
					res => {
						this.submitLoading = false;

						// show text -> done
						this.pageStatus = 'completed';
					},
					error => {
						this.submitLoading = false;

						// show error message
						this.alertService.error(this.translations.common.emailNotExist);

						// reset reCaptcha
						this.recaptcha = false;
					}
				);
		} else {
			this.submitLoading = false;

			// show success message
			this.alertService.error(this.translations.common.completeAllFields);
		}
	}
}
