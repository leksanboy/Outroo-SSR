import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy{
	public playerMobileStatus: boolean;
	public activeSessionStatus: boolean;
	public activeRouter: any;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		// Set component data
		this.activeRouter = this.router.events
			.subscribe(event => {
				if(event instanceof NavigationEnd) {
					if (event.url == '/' || 
						event.url == '/about' || 
						event.url == '/confirm-email' || 
						event.url == '/error' || 
						event.url == '/forgot-password' || 
						event.url == '/logout' || 
						event.url == '/privacy' || 
						event.url == '/reset-password' || 
						event.url == '/signin' || 
						event.url == '/signup' || 
						event.url == '/support') {
						this.activeSessionStatus = false;
					} else {
						this.activeSessionStatus = true
					}
				}
			});
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
	}
}
