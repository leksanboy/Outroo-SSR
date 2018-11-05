import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class PlayerMobileService {
	private subject = new Subject<any>();
	private keepAfterRouteChange = false;

	constructor(
		private router: Router
	) {
		// clear alert messages on route change unless 'keepAfterRouteChange' flag is true
		router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				if (this.keepAfterRouteChange) {
					// only keep for a single route change
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

	create(data: any, keepAfterRouteChange = false) {
		this.keepAfterRouteChange = keepAfterRouteChange;
		this.subject.next(data);
	}

	show(data: any, keepAfterRouteChange = false) {
		this.create(data, keepAfterRouteChange);
	}

	clear() {
		this.subject.next();
	}
}
