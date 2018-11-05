import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { MetaService } from '../seo/meta.service';

@Injectable()
export class UserResolver implements Resolve<any> {
	public environment: any = environment;

	constructor(
		private http: Http,
		private metaService: MetaService,
	) {}

	resolve(route: ActivatedRouteSnapshot): Observable<any> {
		let url = this.environment.url + 'assets/api/user/getUser.php';
		let id = route.params['id'];
		let params = '&id=' + id;
			params = params.replace('&', '?');

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				// User response
				let userData = res.json();

				// Meta data
				let title = userData.name;
				let metaData = {
					page: userData.name,
					title: userData.name,
					description: userData.about ? userData.about : 'DESC',
					keywords: userData.about ? userData.about : 'KEY',
					url: this.environment.url + userData.username,
					image: this.environment.url + (userData.avatar ? userData.avatarUrl : this.environment.avatar)
				}

				// Call metaService
				this.metaService.setData(metaData);

				return res.json() 
			}));
	}
}