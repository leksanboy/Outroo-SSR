import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment/moment';

@Pipe({
	name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {
	transform(value: any, args?: any): any {
		const dateFrom = new Date(value),
			dateTo = new Date(),
			timeDiff = Math.abs(dateTo.getTime() - dateFrom.getTime()),
			diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)),
			time = (diffDays > 1) ? moment().subtract(diffDays, 'days').calendar() : moment(new Date(value)).format('LT');

		return time;
	}
}
