import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';

import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html'
})

export class ErrorComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private metaService: MetaService,
		private router: Router,
		private ssrService: SsrService,
		private userDataService: UserDataService,
		private location: Location,
		private routingStateService: RoutingStateService,
	) {
		// Get translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Set meta
		const metaData = {
			page: this.translations.error.title,
			title: this.translations.error.title,
			description: this.translations.error.description,
			keywords: this.translations.error.description,
			url: this.env.url + 'confirm-email',
			image: this.env.urlCdn + 'common/images/image_color.png'
		};
		this.metaService.setData(metaData);

		// Set Google analytics
		const url = 'error';
		const userId = null;
		this.userDataService.analytics(url, this.translations.error.title, userId);
	}

	ngOnInit() {
		// not in use
	}

	goBack() {
		this.routingStateService.getPreviousUrl();
	}
}
