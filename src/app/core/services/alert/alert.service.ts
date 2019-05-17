import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { Alert } from './alert.model';

@Injectable()
export class AlertService {
	private subject = new Subject<Alert>();
	private keepAfterRouteChange = false;

	constructor(
		private router: Router
	) {
		// clear alert messages on route change unless 'keepAfterRouteChange' flag is true
		router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				// only keep for a single route change
				if (this.keepAfterRouteChange) {
					this.keepAfterRouteChange = false;
				} else {
					this.clear();
				}
			}
		});
	}

	getData(): Observable<any> {
		return this.subject.asObservable();
	}

	create(type: string, message: string, keepAfterRouteChange = false) {
		this.keepAfterRouteChange = keepAfterRouteChange;
		this.subject.next(<Alert>{ type: type, message: message });
	}

	clear() {
		this.subject.next();
	}

	success(message: string, keepAfterRouteChange = false) {
		this.create('success', message, keepAfterRouteChange);
	}

	error(message: string, keepAfterRouteChange = false) {
		this.create('error', message, keepAfterRouteChange);
	}

	warning(message: string, keepAfterRouteChange = false) {
		this.create('warning', message, keepAfterRouteChange);
	}

	publishing(message: string, keepAfterRouteChange = false) {
		this.create('publishing', message, keepAfterRouteChange);
	}
}
