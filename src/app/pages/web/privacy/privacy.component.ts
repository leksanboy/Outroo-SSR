import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

@Component({
	selector: 'app-privacy',
	templateUrl: './privacy.component.html'
})

export class PrivacyComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private metaService: MetaService,
		private router: Router,
		private ssrService: SsrService,
		private userDataService: UserDataService,
	) {
		// Get translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Set meta
		const metaData = {
			page: this.translations.privacy.title,
			title: this.translations.privacy.title,
			description: this.translations.privacy.description,
			keywords: this.translations.privacy.description,
			url: this.env.url + '/',
			image: this.env.url + 'assets/images/image_color.png'
		};
		this.metaService.setData(metaData);

		// Set Google analytics
		let url = 'privacy';
		this.userDataService.analytics(url);
	}

	ngOnInit() {
		// not in use
	}

	goBack(){
		this.router.navigate(['/']);
	}
}
