import { Component, OnInit } from '@angular/core';

declare var ga: Function;

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

	constructor() { }

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'error';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');
	}
}
