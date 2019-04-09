import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

declare var ga: Function;

@Component({
	selector: 'app-privacy',
	templateUrl: './privacy.component.html'
})

export class PrivacyComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];

	constructor(
		private metaService: MetaService,
		private userDataService: UserDataService,
		private ssrService: SsrService,
	) {
		// Get translations
		this.getTranslations(null);
	}

	ngOnInit() {
		// Set Google analytics
		if (this.ssrService.isBrowser) {
			let urlGa = 'privacy';
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
			page: data.privacy.title,
			title: data.privacy.title,
			description: data.privacy.description,
			keywords: data.privacy.description,
			url: this.env.url + '/',
			image: this.env.url + 'assets/images/image_color.png'
		}

		this.metaService.setData(metaData);
	}
}
