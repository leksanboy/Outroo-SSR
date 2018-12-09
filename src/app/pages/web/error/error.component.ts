import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

declare var ga: Function;

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html'
})

export class ErrorComponent implements OnInit {

	constructor(
		private titleService: Title,
	) { }

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'error';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');

		// Set page title
		this.titleService.setTitle('Error');
	}
}
