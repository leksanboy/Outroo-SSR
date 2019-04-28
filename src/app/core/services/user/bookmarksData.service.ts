import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HeadersService } from '../headers/headers.service';

@Injectable()
export class BookmarksDataService {
	public env: any = environment;

	constructor(
		private http: Http,
		private headersService: HeadersService
	) { }

	default(data: any) {
		let url = this.env.url + 'assets/api/bookmarks/default.php';
		let params =	'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	markUnmark(data: any) {
		let url = this.env.url + 'assets/api/bookmarks/addRemove.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}
}
