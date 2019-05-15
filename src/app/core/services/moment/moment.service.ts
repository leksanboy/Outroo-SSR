import { Injectable } from '@angular/core';

import * as moment from 'moment/moment';

@Injectable()
export class MomentService {
	constructor() { }

	setData(data: any) {
		// Set by default if not exists
		data = data || 1;

		if (data === 1) {
			// English
			moment.locale('en');

			moment.updateLocale('en', {
				relativeTime : {
					future: 'in %s',
					past: '%s',
					s: '%d\s',
					ss: '%d\s',
					m: '%d\m',
					mm: '%d\m',
					h: '%d\h',
					hh: '%d\h',
					d: '%d\d',
					dd: '%d\d',
					M: '%d\M',
					MM: '%d\M',
					y: '%d\Y',
					yy: '%d\Y'
				}
			});
		} else if (data === 2) {
			// Spanish
			moment.locale('es');

			moment.updateLocale('es', {
				relativeTime : {
					future: 'en %s',
					past: '%s',
					s: '%d\s',
					ss: '%d\s',
					m: '%d\m',
					mm: '%d\m',
					h: '%d\h',
					hh: '%d\h',
					d: '%d\d',
					dd: '%d\d',
					M: '%d\M',
					MM: '%d\M',
					y: '%d\Y',
					yy: '%d\Y'
				}
			});
		} else if (data === 3) {
			// Russian
			moment.locale('ru');

			moment.updateLocale('ru', {
				relativeTime : {
					future: 'через %s',
					past: '%s',
					s: '%d\с',
					ss: '%d\с',
					m: '%d\м',
					mm: '%d\м',
					h: '%d\ч',
					hh: '%d\ч',
					d: '%d\Д',
					dd: '%d\Д',
					M: '%d\М',
					MM: '%d\М',
					y: '%d\Г',
					yy: '%d\Г'
				}
			});
		}
	}
}
