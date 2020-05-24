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

	// User options
	userOptions(type, item) {
		switch (type) {
			case 'openNewSession':
				const dataONS = {
					type: 'create'
				};

				this.close();
				this.sessionService.setDataAddAccount(dataONS);
				break;
			case 'setCurrentUser':
				const dataSCU = {
					type: 'set',
					data: item
				};

				this.close();
				this.sessionService.setDataAddAccount(dataSCU);
				break;
			case 'closeSession':
				const dataCS = {
					type: 'close',
					data: item
				};

				this.sessionService.setDataAddAccount(dataCS);
				break;
		}
	}

	close() {
		this.bottomSheetRef.dismiss();
	}
}
