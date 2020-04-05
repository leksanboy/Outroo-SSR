import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HeadersService } from '../headers/headers.service';

@Injectable()
export class AudioDataService {
	public env: any = environment;

	constructor(
		private httpClient: HttpClient,
		private headersService: HeadersService
	) {}

	default(data: any) {
		const url = this.env.url + 'assets/api/audios/default.php';
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
		const url = this.env.url + 'assets/api/audios/search.php';
		let params = 	'&caption=' + data.caption +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	getSong(data: any) {
		const url = this.env.url + 'assets/api/audios/getSong.php';
		let params = '&name=' + data.name;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	addRemove(data: any) {
		const url = this.env.url + 'assets/api/audios/addRemove.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	updateReplays(data: any) {
		const url = this.env.url + 'assets/api/audios/updateReplays.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	defaultPlaylists(data: any) {
		const url = this.env.url + 'assets/api/audios/defaultPlaylists.php';
		let params =	(data.user ? ('&user=' + data.user) : '') +
						'&type=' + data.type;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	getPlaylist(data: any) {
		const url = this.env.url + 'assets/api/audios/getPlaylist.php';
		let params =	(data.id ? '&id=' + data.id : '') +
						(data.name ? '&name=' + data.name : '');
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	createPlaylist(data: any) {
		const url = this.env.url + 'assets/api/audios/createPlaylist.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	addRemovePlaylist(data: any) {
		const url = this.env.url + 'assets/api/audios/addRemovePlaylist.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	followPlaylist(data: any) {
		const url = this.env.url + 'assets/api/audios/followPlaylist.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	publicPrivate(data: any) {
		const url = this.env.url + 'assets/api/audios/publicPrivate.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
}
