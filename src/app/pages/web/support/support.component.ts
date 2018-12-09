import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

declare var ga: Function;

@Component({
	selector: 'app-support',
	templateUrl: './support.component.html'
})

export class SupportComponent implements OnInit {
	private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	public environment: any = environment;
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public pageStatus: string = 'default';
	public email: string;
	public recaptcha: boolean;
	public translations: any = [];

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userDataService: UserDataService,
		private alertService: AlertService
	) {
		// Get translations
		this.getTranslations(1);
	}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'support';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');

		// Set page title
		this.titleService.setTitle('Support');

		// Form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
			content: ['', [Validators.required]]
		});

		// destroy session & reset login
		this.userDataService.logout();
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Verify recaptcha
	verifyReCaptcha(data){
		this.recaptcha = data ? true : false;
	}

	// Submit
	submit(ev: Event) {
		this.submitLoading = true;
		this.email = this.actionForm.get('email').value;

		if (this.actionForm.get('email').value.trim().length > 0 && 
			this.actionForm.get('content').value.trim().length > 0 && 
			this.recaptcha
		) {
			let data = {
				email: this.actionForm.get('email').value,
				content: this.actionForm.get('content').value
			}

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
