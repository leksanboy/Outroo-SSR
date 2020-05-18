import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HeadersService } from '../headers/headers.service';

@Injectable()
export class PublicationsDataService {
	public env: any = environment;

	constructor(
		private httpClient: HttpClient,
		private headersService: HeadersService
	) {}

	default(data: any) {
		const url = this.env.url + 'assets/api/publications/default.php';
		let params =	(data.user ? ('&user=' + data.user) : '') +
						'&type=' + data.type +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	search(data: any) {
		const url = this.env.url + 'assets/api/publications/search.php';
		let params = 	'&caption=' + data.caption +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	searchTop(data: any) {
		const url = this.env.url + 'assets/api/publications/searchTop.php';
		let params = 	'&caption=' + data.caption +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	searchTag(data: any) {
		const url = this.env.url + 'assets/api/publications/searchTag.php';
		let params = 	'&caption=' + data.caption +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	createPublication(data: any) {
		const url = this.env.url + 'assets/api/publications/create.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	addRemove(data: any) {
		const url = this.env.url + 'assets/api/publications/addRemove.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	likeUnlike(data: any) {
		const url = this.env.url + 'assets/api/publications/likeUnlike.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	markUnmark(data: any) {
		const url = this.env.url + 'assets/api/publications/markUnmark.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	likes(data: any) {
		const url = this.env.url + 'assets/api/publications/likes.php';
		let params =	'&id=' + data.id +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	enableDisableComments(data: any) {
		const url = this.env.url + 'assets/api/publications/enableDisableComments.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	comment(data: any) {
		const url = this.env.url + 'assets/api/publications/comment.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	comments(data: any) {
		const url = this.env.url + 'assets/api/publications/comments.php';
		let params =	'&id=' + data.id +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	getPost(data: any) {
		const url = this.env.url + 'assets/api/publications/getPost.php';
		let params =	(data.id ? '&id=' + data.id : '') +
						(data.name ? '&name=' + data.name : '');
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	updateReplays(data: any) {
		const url = this.env.url + 'assets/api/publications/updateReplays.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	checkLike(data: any) {
		const url = this.env.url + 'assets/api/publications/checkLike.php';
		let params = 	'&id=' + data.id;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	urlVideoInformation(data: any) {
		const url = this.env.url + 'assets/api/publications/urlVideoInformation.php';
		let params =	'&type=' + data.type +
						'&url=' + data.url;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
}
