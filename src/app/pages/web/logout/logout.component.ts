import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html'
})

export class LogoutComponent implements OnInit {
	public env: any = environment;
	public translations: any = [];
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public userData: any;

	constructor(
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private metaService: MetaService,
		private userDataService: UserDataService,
		private ssrService: SsrService,
	) {
		// Get translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Set meta
		const metaData = {
			page: this.translations.logOut.title,
			title: this.translations.logOut.title,
			description: this.translations.logOut.description,
			keywords: this.translations.logOut.description,
			url: this.env.url + '/',
			image: this.env.url + 'assets/images/image_color.png'
		};
		this.metaService.setData(metaData);

		// Destroy session & reset login
		this.userDataService.logout();

		// Set Google analytics
		const url = 'logout';
		const userId = null;
		this.userDataService.analytics(url, this.translations.logOut.title, userId);
	}

	ngOnInit() {
		// not in use
	}
}
