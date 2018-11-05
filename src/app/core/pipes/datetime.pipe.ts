import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment/moment';

@Pipe({
	name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {
	transform(value: any, args?: any): any {
        let dateFrom = new Date(value),
            dateTo = new Date();
        
        let timeDiff = Math.abs(dateTo.getTime() - dateFrom.getTime()),
            diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

        let time = (diffDays > 1) ? moment().subtract(diffDays, 'days').calendar() : moment(new Date(value)).format('LT');

        return time;
	}
}
