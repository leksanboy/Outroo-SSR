import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UserDataService } from '../user/userData.service';

@Injectable()
export class LangResolver implements Resolve<any> {
	constructor(
		private userDataService: UserDataService
	) {}

	resolve() {
		return this.userDataService.getTranslations(null);
	}
}
