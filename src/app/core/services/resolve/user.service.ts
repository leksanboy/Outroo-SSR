import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { UserDataService } from '../user/userData.service';
// import { MetaService } from '../seo/meta.service';

@Injectable()
export class UserResolver implements Resolve<any> {
	public environment: any = environment;
	private subjectUserData = new Subject();

	constructor(
		private http: HttpClient,
		private userDataService: UserDataService,
		// private metaService: MetaService,
	) {}

	resolve(route: ActivatedRouteSnapshot): Promise<any> {
		let id = route.params['id'];

		return this.userDataService.getUserMetaData(id);
	}
}