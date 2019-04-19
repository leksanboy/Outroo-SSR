import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { UserDataService } from '../user/userData.service';

@Injectable()
export class UserResolver implements Resolve<any> {
	constructor(
		private http: HttpClient,
		private userDataService: UserDataService
	) {}

	resolve(route: ActivatedRouteSnapshot) {
		let id = route.params['id'];

		return this.userDataService.getUserData(id);
	}
}
