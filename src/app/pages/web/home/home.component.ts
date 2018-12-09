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
	selector: 'app-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
	public environment: any = environment;
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public showPassword: boolean;
	public sessionData: any = [];
	public translations: any = [];
	public activeSessionStatus: boolean;
	public errorMessage: boolean;
	public errorMessageContent: string;

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private userDataService: UserDataService
	) {
		// User data from routing resolve
		this.activeSessionStatus = this.activatedRoute.snapshot.data.loginValidationResolvedData;

		// Get translations
		this.getTranslations(1);
	}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'signin';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');

		// Set page title
		this.titleService.setTitle('Outroo');

		// login form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});

		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// If session is set
		if (this.sessionData)
			if (this.sessionData.current)
				this.router.navigate([this.sessionData.current.username]);
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;

				// Set page title
				this.titleService.setTitle(this.environment.name);
			});
	}

	// Submit
	submit(event: Event) {
		this.submitLoading = true;
		this.errorMessage = false;

		if (this.actionForm.get('email').value.trim().length > 0 &&
			this.actionForm.get('password').value.trim().length > 0
		) {
			this.userDataService.login(this.actionForm.get('email').value, this.actionForm.get('password').value)
				.subscribe(
					res => {
						this.router.navigate(['home']);
					},
					error => {
						this.submitLoading = false;
						this.errorMessage = true;
						this.errorMessageContent = this.translations.emailOrPasswordIncorrect;
					}
				);
		} else {
			this.submitLoading = false;
			this.errorMessage = true;
			this.errorMessageContent = this.translations.completeAllFields;
		}
	}
}
