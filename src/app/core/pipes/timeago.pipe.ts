import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment/moment';

@Pipe({
	name: 'timeago'
})
export class TimeagoPipe implements PipeTransform {
	transform(value: any, args?: any): any {
        let prefix: string = ' · ';
        
        let time = prefix + moment(moment.parseZone(value)).fromNow();
        
        return time;
	}
}
