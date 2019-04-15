import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { UserDataService } from './../user/userData.service';

@Injectable()
export class LoginValidationResolver implements Resolve<any> {

	constructor(
		public userDataService: UserDataService
	) { }

	resolve(): Observable<any> {
		let sessionData = this.userDataService.getSessionData();
		let result: any = sessionData ? false : true;

		return result;
	}
} 