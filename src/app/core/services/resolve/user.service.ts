import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { UserDataService } from '../user/userData.service';

@Injectable()
export class UserResolver implements Resolve<any> {
	constructor(
		private userDataService: UserDataService
	) {}

	resolve(route: ActivatedRouteSnapshot) {
		const id = route.params['id'];
		const data = this.userDataService.getUserData(id);

		return data;
	}
}
