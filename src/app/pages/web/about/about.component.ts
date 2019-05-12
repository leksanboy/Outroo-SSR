import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

declare var global: any;

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html'
})

export class AboutComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
	public window: any = global;

	constructor(
		private activatedRoute: ActivatedRoute,
		private metaService: MetaService,
		private router: Router,
		private ssrService: SsrService,
		private userDataService: UserDataService
	) {
		// Get translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Set meta
		const metaData = {
			page: this.translations.about.title,
			title: this.translations.about.title,
			description: this.translations.about.description,
			keywords: this.translations.about.description,
			url: this.env.url + 'about',
			image: this.env.url + 'assets/images/image_color.png'
		};
		this.metaService.setData(metaData);

		// Set Google analytics
		const url = 'about';
		this.userDataService.analytics(url);
	}

	ngOnInit() {
		// not in use
	}

	goBack() {
		this.router.navigate(['/']);
	}

	downloadAssetPack() {
		this.window.location.href = './assets/images/Asset_pack.zip';
	}
}
