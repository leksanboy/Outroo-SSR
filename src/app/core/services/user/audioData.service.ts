import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HeadersService } from '../headers/headers.service';
import { PlayerService } from '../player/player.service';

declare var Vibrant: any;

@Injectable()
export class AudioDataService {
	public env: any = environment;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private httpClient: HttpClient,
		private headersService: HeadersService,
		private playerService: PlayerService
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
		let params = 	'&type=' + data.type +
						'&caption=' + data.caption +
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
		let params = 	data.id ? ('&id=' + data.id) : '' +
						data.name ? ('&name=' + data.name) : '';
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

	general(data: any) {
		const url = this.env.url + 'assets/api/audios/general.php';
		let params =	'&user=' + data.user +
						'&type=' + data.type +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	getRecommendedPlaylists(data) {
		const url = this.env.url + 'assets/api/audios/getRecommendedPlaylists.php';
		let params = '&user=' + data.user;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	getGenres(data: any) {
		const url = this.env.url + 'assets/api/audios/getGenres.php';
		let params =	'&id=' + data.id +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	getCoverColor(type, image) {
		if (image.length) {
			let self = this;
			let img = this.document.createElement('img');
			img.setAttribute('src', image);

			img.addEventListener('load', () => {
				let vibrant = new Vibrant(img);
				let swatches = vibrant.swatches()

				for (let swatch in swatches) {
					if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
						if (swatch == 'Vibrant') {
							let res = {
								type: type,
								color: swatches[swatch].getRgb()
							};
							self.playerService.setCoverTrack(res);
						}
					}
				}
			});
		} else {
			return null;
		}
	}
}
