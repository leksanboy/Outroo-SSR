import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HeadersService } from '../headers/headers.service';

@Injectable()
export class ChatDataService {
    public env: any = environment;

	constructor(
		private httpClient: HttpClient,
		private headersService: HeadersService
	) {}

	default(data: any) {
		let url = environment.url + this.env.urlApi + '/chat/default.php';
		let params =	'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	conversation(data: any) {
		let url = environment.url + this.env.urlApi + '/chat/conversation.php';
		let params =	'&id=' + data.id +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	addRemove(data: any) {
		let url = environment.url + this.env.urlApi + '/chat/addRemove.php';
		let params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	addRemoveComment(data: any) {
		let url = environment.url + this.env.urlApi + '/chat/addRemoveComment.php';
		let params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	comment(data: any) {
		let url = environment.url + this.env.urlApi + '/chat/comment.php';
		let params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	newChat(data: any){
		let url = environment.url + this.env.urlApi + '/chat/newChat.php';
		let params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
}