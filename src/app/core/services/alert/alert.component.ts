import { Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';

import { Alert } from './alert.model';
import { AlertService } from './alert.service';

@Component({
	selector: 'app-alert',
	templateUrl: 'alert.component.html',
	animations: [
		trigger('showFromTopAnimation', [
			transition(':enter', [
				style({transform: 'translateY(-100%)'}),
				animate('200ms', style({'transform': 'translateY(0)', '-webkit-transform': 'translateY(0)'}))
			]),
			transition(':leave', [
				style({transform: 'translateY(0)'}),
				animate('200ms', style({'transform': 'translateY(-100%)', '-webkit-transform': 'translateY(-100%)'}))
			])
		])
	]
})

export class AlertComponent implements OnInit {
	public alerts: Alert[] = [];

	constructor(
		private alertService: AlertService
	) { }

	ngOnInit() {
		this.alertService.getData()
			.subscribe((alert: Alert) => {
				if (!alert) {
					this.alerts = [];
					return;
				}

				// clear all for show only one
				this.alerts = [];
				this.alerts.push(alert);

				setTimeout(() => {
					this.close(alert);
				}, 3000);
			});
	}

	close(alert: Alert) {
		this.alerts = this.alerts.filter(x => x !== alert);
	}
}
