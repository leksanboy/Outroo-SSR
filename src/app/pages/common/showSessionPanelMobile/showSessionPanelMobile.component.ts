import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { SessionService } from '../../../../app/core/services/session/session.service';

@Component({
	selector: 'app-showSessionPanelMobile',
	templateUrl: './showSessionPanelMobile.component.html'
})
export class ShowSessionPanelMobileComponent {
	public environment: any = environment;
	public sessionData: any = [];

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private bottomSheetRef: MatBottomSheetRef<ShowSessionPanelMobileComponent>,
		private sessionService: SessionService
	) {
		this.sessionData = this.data.sessionData;
	}

	// Set user
	setCurrentUser(data) {
		let current = {
			data: data,
			type: 'set'
		}

		this.sessionService.setDataAddAccount(current);
		this.bottomSheetRef.dismiss();
	}
}
