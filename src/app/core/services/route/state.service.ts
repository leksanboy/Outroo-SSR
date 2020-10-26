import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SsrService } from '../ssr.service';
import { SessionService } from '../session/session.service';

declare var global: any;

@Injectable()
export class RoutingStateService {
	public window: any = global;
	private history = [];

	constructor(
		private router: Router,
		private ssrService: SsrService,
		private sessionService: SessionService,
	) {}

	loadRouting(): void {
		// Get history from LocalStorage
		this.history = this.getBrowserHistory('get', null);

		// Routing
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(({urlAfterRedirects}: NavigationEnd) => {
				if (this.history) {
					if (this.history[this.history.length - 1] !== urlAfterRedirects) {
						this.history = [...this.history, urlAfterRedirects];

						// Set come from user button
						this.sessionService.setComeFromUserButton(false);

						// Set last url
						this.sessionService.setDataLastUrl(urlAfterRedirects);

						// Set localStorage
						this.getBrowserHistory('set', this.history);
					}
				}
			});
	}

	getBrowserHistory(type, data) {
		if (this.ssrService.isBrowser) {
			if (type === 'set') {
				this.window.localStorage.setItem('browserHistory', data);
			} else if (type === 'get') {
				const BH = this.window.localStorage.getItem('browserHistory');
				const newBH = BH ? BH.split(',') : [];

				return newBH;
			}
		}
	}

	getPreviousUrl() {
		// Remove last page
		this.history.pop();

		// Set localStorage
		this.getBrowserHistory('set', this.history);

		// Navigate
		const url = this.history[this.history.length - 1] || '/';
		this.router.navigate([url]);
	}

	getLastUrl() {
		const url = (this.history ? this.history[this.history.length - 1] : null) || '/';
		return url;
	}

	getUrlBeforeLogin() {
		const url = (this.history ? this.history[this.history.length - 2] : null) || '/';
		return url;
	}
}
