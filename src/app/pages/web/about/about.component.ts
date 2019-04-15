import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare var ga: Function;
declare var global: any;

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html'
})

export class AboutComponent implements OnInit {
	public environment: any = environment;
	public window: any = global;

	constructor() {}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'about';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');
	}

	downloadAssetPack(){
		this.window.location.href = './assets/images/Asset_pack.zip';
	}
}
