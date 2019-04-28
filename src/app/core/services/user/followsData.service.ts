import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HeadersService } from '../headers/headers.service';

@Injectable()
export class FollowsDataService {
	public env: any = environment;

	constructor(
		private http: Http,
		private headersService: HeadersService
	) { }

	default(data: any) {
		let url = this.env.url + 'assets/api/follows/default.php';
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

	search(data: any){
		let url = this.env.url + 'assets/api/follows/search.php';
		let params = 	'&caption=' + data.caption +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	searchFollowing(data: any){
		let url = this.env.url + 'assets/api/follows/searchFollowing.php';
		let params = 	'&user=' + data.user +
						'&caption=' + data.caption +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	followUnfollow(data: any) {
		let url = this.env.url + 'assets/api/follows/followUnfollow.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	checkFollowing(data: any) {
		let url = this.env.url + 'assets/api/follows/checkFollowing.php';
		let params = 	'&receiver=' + data.receiver;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}
}
