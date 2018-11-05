import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

declare var ga: Function;

@Component({
	selector: 'app-privacy',
	templateUrl: './privacy.component.html'
})

export class PrivacyComponent implements OnInit {

	constructor(
		private titleService: Title,
	) { }

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'privacy';
    	ga('set', 'page', urlGa);
    	ga('send', 'pageview');

    	// Set page title
		this.titleService.setTitle('Privacy');
	}
}
