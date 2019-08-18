import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { SessionService } from '../../../../app/core/services/session/session.service';

@Component({
	selector: 'app-active-sessions-mobile',
	templateUrl: './activeSessionsMobile.component.html'
})
export class ActiveSessionsMobileComponent {
	public environment: any = environment;
	public sessionData: any = [];

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private bottomSheetRef: MatBottomSheetRef<ActiveSessionsMobileComponent>,
		private sessionService: SessionService
	) {
		this.sessionData = this.data.sessionData;
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

	close() {
		this.bottomSheetRef.dismiss();
	}
}
