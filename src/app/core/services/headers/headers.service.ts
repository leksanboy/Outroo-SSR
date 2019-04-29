import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';

import { environment } from '../../../../environments/environment';
import { SessionService } from '../session/session.service';
import { SsrService } from '../ssr.service';

declare var global: any;

@Injectable()
export class HeadersService {
	public env: any = environment;
	public numberOfClicks: any = [];
	// public limitedClicksPerSecond = 30;
	public limitedTime = 1000;
	public window: any = global;

	constructor(
		private sessionService: SessionService,
		private ssrService: SsrService
	) {}

	getHeaders() {
		if (this.ssrService.isBrowser) {
			let userData: any = JSON.parse(this.window.localStorage.getItem('userData_' + this.env.authHash));
			let authorization = userData ? userData.current.authorization : '';

			// Validate authorization
			// let authorizationValidator = this.clicksPerSecond() ? authorization : '';
			// if (!authorizationValidator)
			// 	alert("STOP DOING THAT");

			// Headers
			let headers = new Headers();
			headers.append('Content-Type', 'application/json');
			// headers.append('Authorization', authorizationValidator);
			headers.append('Authorization', authorization);

			return new RequestOptions({ headers: headers });
		}
	}

	// clicksPerSecond() {
	// 	if(this.numberOfClicks.length < this.limitedClicksPerSecond) {
	// 		this.numberOfClicks.push(new Date().getTime());

	// 		return true;
	// 	} else {
	// 		let diff = this.numberOfClicks[this.numberOfClicks.length -1] - this.numberOfClicks[0];
			
	// 		// If is into limitedTime
	// 		this.numberOfClicks.shift();
	// 		this.numberOfClicks.push(new Date().getTime());
			
	// 		// Return false for error to cancel other petitions
	// 		return (diff < this.limitedTime) ? false : true;
	// 	}
	// }
}
