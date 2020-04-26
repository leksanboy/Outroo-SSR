import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { SessionService } from '../session/session.service';
import { SsrService } from '../ssr.service';

declare var global: any;

@Injectable()
export class HeadersService {
	public env: any = environment;
	public window: any = global;
	public limitedClicks = {
		clicks: 50,
		time: 1000,
		clicked: []
	};

	constructor(
		private sessionService: SessionService,
		private ssrService: SsrService
	) {}

	getHeaders() {
		if (this.ssrService.isBrowser) {
			const userData: any = JSON.parse(this.window.localStorage.getItem('userData'));
			const authorization = userData ? userData.current.authorization : 'empty';
			const headers = new HttpHeaders().set('Authorization', authorization).set('Content-Type', 'application/json');

			// const authorizationValidator = this.clicksPerSecond() ? authorization : '';
			// if (!authorizationValidator) {
			// 	alert('STOP DOING THAT');
			// }

			return { headers: headers };
		}
	}

	clicksPerSecond() {
		if (this.limitedClicks.clicked.length < this.limitedClicks.clicks) {
			this.limitedClicks.clicked.push(new Date().getTime());

			return true;
		} else {
			const diff = this.limitedClicks.clicked[this.limitedClicks.clicked.length - 1] - this.limitedClicks.clicked[0];

			// If is into limitedTime
			this.limitedClicks.clicked.shift();
			this.limitedClicks.clicked.push(new Date().getTime());

			// Return false for error to cancel other petitions
			return (diff < this.limitedClicks.time) ? false : true;
		}
	}
}
