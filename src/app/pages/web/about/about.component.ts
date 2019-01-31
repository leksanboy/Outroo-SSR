import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { MetaService } from '../../../../app/core/services/seo/meta.service';

declare var ga: Function;
declare var global: any;

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html'
})

export class AboutComponent implements OnInit {
	public environment: any = environment;
	public window: any = global;

	constructor(
		private titleService: Title,
		private metaService: MetaService,
	) {
		// Meta data
		let metaData = {
			page: 'About',
			title: 'About',
			description: 'abous us, all good.',
			keywords: 'abous us, all good.',
			url: this.environment.url + 'about',
			image: this.environment.url + 'assets/images/image_color.png'
		}

		// Call metaService
		this.metaService.setData(metaData);
	}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'about';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');

		// Set page title
		this.titleService.setTitle('About us');
	}

	downloadAssetPack(){
		this.window.location.href = './assets/images/Asset_pack.zip';
	}
}
