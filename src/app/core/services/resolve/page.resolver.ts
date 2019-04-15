import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SeoService } from '../seo.service';
import { SsrService } from '../ssr.service';
import { SsrRedirectService } from '../ssr.redirect.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class PageResolver implements Resolve<boolean> {

	constructor(private router: Router,
				private ssrService: SsrService,
				private ssrRedirectService: SsrRedirectService,
				private seoService: SeoService) {};

	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

		if (this.ssrService.isBrowser) {
			console.groupCollapsed(`%c PageResolver`, 'color:#00E2FF;font-size:12px;');
			console.log(route.data);
			console.log(route);
			console.log(state);
			console.groupEnd();
		} else {
			console.log(`PageResolver: ${state.url}`);
		};

		if (route.data.page === `404`) this.ssrRedirectService.setStatus(404, `Not Found`);
		this.seoService.updateMeta(route.data.page, state.url);

		return of(true);
	};

	private redirect301(url: string): void {
		this.ssrRedirectService.redirectWithStatus(301, `Moved Permanently`, url);
		this.router.navigate([url]);
	};
};
