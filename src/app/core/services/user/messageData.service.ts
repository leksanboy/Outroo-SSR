import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HeadersService } from '../headers/headers.service';

@Injectable()
export class MessageDataService {
	public env: any = environment;

	constructor(
		private httpClient: HttpClient,
		private headersService: HeadersService
	) {}

	default(data: any) {
		const url = environment.url + 'assets/api/message/default.php';
		let params =	data.id ? ('&id=' + data.id) : '' +
						'&user=' + data.user +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	newComment(data: any){
		const url = environment.url + 'assets/api/message/newComment.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => { 
				return res;
			}));
	}

	addRemove(data: any) {
		const url = environment.url + 'assets/api/message/addRemove.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}
}
