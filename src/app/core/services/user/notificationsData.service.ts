import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HeadersService } from '../headers/headers.service';

@Injectable()
export class NotificationsDataService {

	constructor(
		private http: Http,
		private headersService: HeadersService
	) { }

	default(data: any) {
		let url = environment.url + 'assets/api/notifications/default.php';
		let params =	'&user=' + data.user +
						'&type=' + data.type +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	share(data: any) {
		let url = environment.url + 'assets/api/notifications/share.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	pending(id: any) {
		let url = environment.url + 'assets/api/notifications/pending.php';
		let params =	'&id=' + id;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	addRemove(data: any) {
		let url = environment.url + 'assets/api/notifications/addRemove.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}
}
