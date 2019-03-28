import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SsrService } from './core/services/ssr.service';

const URLS: string[] = [
	`/`,
	`/about`,
	`/confirm-email`,
	`/error`,
	`/forgot-password`,
	`/logout`,
	`/privacy`,
	`/reset-password`,
	`/signin`,
	`/signup`,
	`/support`
];

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {
	public activeSessionStatus: boolean;
	public activeRouter: any;

	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				private ssrService: SsrService) {
		// Set component data
		this.activeRouter = this.router.events.subscribe(event => {
				if (event instanceof NavigationEnd) {
					this.activeSessionStatus = URLS.indexOf(event.url) !== -1;
					if (!this.ssrService.isBrowser) {
						console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>> NavigationEnd`);
					}
				}
			});
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
	}
}
