import { Component, OnInit} from '@angular/core';
import { environment } from '../../../../environments/environment';

import { UserDataService } from '../user/userData.service';

@Component({
	selector: 'cookies',
	templateUrl: 'cookies.component.html'
})

export class CookiesComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
	public sessionData: any = [];
	public cookiesShown: boolean;

	constructor(
		private userDataService: UserDataService
	) { }

	ngOnInit() {
		// Check if set
		this.cookies('check');

		// Get translations
		this.getTranslations(null);
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
				console.log("this.translations", this.translations);
			});
	}

	// Set/Get
	cookies(type) {
		if (type === 'check') {
			const check = this.userDataService.cookies('check');
			this.cookiesShown = check ? false : true;
		} else if (type === 'close') {
			this.userDataService.cookies('set');
			this.cookiesShown = false;
		}
	}
}
