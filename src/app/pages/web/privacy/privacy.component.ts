import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { MetaService } from '../../../../app/core/services/seo/meta.service';

declare var ga: Function;

@Component({
	selector: 'app-privacy',
	templateUrl: './privacy.component.html'
})

export class PrivacyComponent implements OnInit {
	public environment: any = environment;

	constructor(
		private titleService: Title,
		private metaService: MetaService
	) {
		this.setMetaData();
	}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'privacy';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');

		// Set page title
		this.titleService.setTitle('Privacy');
	}

	setMetaData() {
		let metaData = {
			page: 'Privacy',
			title: 'Privacy',
			description: 'Terms conditions and privacy policy.',
			keywords: 'Terms conditions and privacy policy.',
			url: this.environment.url + 'about',
			image: this.environment.url + 'assets/images/image_color.png'
		};

		this.metaService.setData(metaData);
	}
}
