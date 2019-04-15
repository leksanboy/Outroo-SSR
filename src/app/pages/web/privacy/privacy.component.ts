import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare var ga: Function;

@Component({
	selector: 'app-privacy',
	templateUrl: './privacy.component.html'
})

export class PrivacyComponent implements OnInit {
	public environment: any = environment;

	constructor() {}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'privacy';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');
	}
}
