import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { environment } from '../../../../environments/environment';

import { UserDataService } from '../user/userData.service';
import { SessionService } from '../session/session.service';
import { RoutingStateService } from '../route/state.service';

@Component({
	selector: 'app-cookies',
	templateUrl: 'cookies.component.html'
})

export class CookiesComponent implements OnInit, OnDestroy {
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
		this.setStatus('check');

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
	setStatus(type) {
		if (type === 'check') {
			const check = this.userDataService.cookies('check');
			this.status = check;
		} else if (type === 'close') {
			this.userDataService.cookies('set');
			this.status = false;

			// cookies
			let date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
			document.cookie = 'Beatfeel=' + JSON.stringify(Date.now()) + ';path=/;domain=' + this.env.urlCookie + ';expires=' + date.toUTCString() + ';promo_shown=1;SameSite=Lax;Secure;';
		}
	}

	getStyle(url) {
		if (url === '/') {
			this.style = 'home';
		} else if (url === '/about' ||
				url === '/confirm-email' ||
				url === '/forgot-password' ||
				url === '/logout' ||
				url === '/privacy' ||
				url === '/reset-password' ||
				url === '/signin' ||
				url === '/signup' ||
				url === '/support'
		) {
			this.style = 'web';
		} else {
			let session = this.userDataService.getSessionData();

			if (session) {
				this.style = null;
			} else{
				this.style = 'web';
			}
		}
	}
}
