import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { UserDataService } from './../user/userData.service';

@Injectable()
export class LoginResolver implements Resolve<any> {
	constructor(
		public userDataService: UserDataService
	) {}

	resolve(): Observable<any> {
		const sessionData = this.userDataService.getSessionData();
		const result: any = sessionData ? false : true;

		return result;
	}
}
