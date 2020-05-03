import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

@Component({
	selector: 'app-active-sessions-mobile',
	templateUrl: './activeSessionsMobile.component.html'
})
export class ActiveSessionsMobileComponent {
	public env: any = environment;
	public translations: any;
	public sessionData: any = [];

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private bottomSheetRef: MatBottomSheetRef<ActiveSessionsMobileComponent>,
		private sessionService: SessionService,
		private userDataService: UserDataService
	) {
		this.sessionData = this.data.sessionData;

		// Get translations
		this.getTranslations(null);
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Set user
	setCurrentUser(data) {
		const current = {
			data: data,
			type: 'set'
		};

		this.sessionService.setDataAddAccount(current);
		this.bottomSheetRef.dismiss();
	}

	openNewSession() {
		this.close();

		const data = {
			type: 'create'
		};

		this.sessionService.setDataAddAccount(data);
	}

	close() {
		this.bottomSheetRef.dismiss();
	}
}
