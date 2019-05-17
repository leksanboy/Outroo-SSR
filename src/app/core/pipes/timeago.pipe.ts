import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment/moment';

@Pipe({
	name: 'timeago'
})
export class TimeagoPipe implements PipeTransform {
	transform(value: any, args?: any): any {
		const prefix = ' · ',
		time = prefix + moment(moment.parseZone(value)).fromNow();

		return time;
	}
}

