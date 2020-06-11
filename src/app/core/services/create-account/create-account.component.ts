import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { environment } from '../../../../environments/environment';

import { UserDataService } from '../user/userData.service';
import { SessionService } from '../session/session.service';
import { RoutingStateService } from '../route/state.service';

@Component({
	selector: 'app-create-account',
	templateUrl: 'create-account.component.html'
})

export class CreateAccountComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public translations: any = [];
	public status: boolean;
	public style: any;
	public activeLanguage: any;
	public activeLastUrl: any;

	constructor(
		private userDataService: UserDataService,
		private sessionService: SessionService,
		private routingStateService: RoutingStateService,
	) {
		let url = this.routingStateService.getLastUrl();
		this.getStyle(url);

		// Get translations
		this.getTranslations(null);

		// Check if cookies set
		this.setStatus('check', url);

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				this.getTranslations(data);
			});

		// Get last url
		this.activeLastUrl = this.sessionService.getDataLastUrl()
			.subscribe(data => {
				this.getStyle(data);
			});
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeLanguage.unsubscribe();
		this.activeLastUrl.unsubscribe();
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Set/Get
	setStatus(type, url) {
		if (type === 'check') {
			let session = this.userDataService.getSessionData();

			if (session || url === '/signup') {
				this.status = false;
			} else {
				this.status = true;
			}
		} else if (type === 'close') {
			this.status = false;
		}
	}

	getStyle(url) {
		if (url === '/') {
			this.style = 'home';
		} else {
			let session = this.userDataService.getSessionData();

			if (session || url === '/signup') {
				this.style = null;
			} else{
				this.style = 'web';
			}
		}
	}
}
