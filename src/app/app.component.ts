import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

import { UserDataService } from './core/services/user/userData.service';
import { SsrService } from './core/services/ssr.service';
import { RoutingStateService } from './core/services/route/state.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {
	public activeSessionStatus: boolean;
	public activeRouter: any;
	public ssrServiceBrowser: any;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private userDataService: UserDataService,
		private ssrService: SsrService,
		private routingStateService: RoutingStateService,
		private deviceService: DeviceDetectorService
	) {
		/* log('deviceService:', this.deviceService.getDeviceInfo()); */
		this.ssrServiceBrowser = this.ssrService.isBrowser;

		// Set null for get new data
		if (this.ssrService.isBrowser) {
			this.userDataService.setLocalStotage('newsPage', null);
			this.userDataService.setLocalStotage('bookmarksPage', null);
			this.userDataService.setLocalStotage('notificationsPage', null);
		}

		// Set component data
		this.activeRouter = this.router.events.subscribe(event => {
				if (event instanceof NavigationEnd) {
					if (event.url === '/' ||
						event.url === '/confirm-email' ||
						event.url === '/reset-password' ||
						event.url === '/logout'
					) {
						this.activeSessionStatus = false;
					} else {
						this.activeSessionStatus = true;
					}
				}
			});

		// Load navigation history
		this.routingStateService.loadRouting();
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
	}
}
