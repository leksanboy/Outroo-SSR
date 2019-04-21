import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HeadersService } from '../headers/headers.service';

@Injectable()
export class AudioDataService {

	constructor(
		private http: Http,
		private headersService: HeadersService
	) { }

	default(data: any) {
		let url = environment.url + 'assets/api/audios/default.php';
		let params =	(data.user ? ('&user=' + data.user) : '') +
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
		let url = environment.url + 'assets/api/audios/search.php';
		let params = 	'&caption=' + data.caption +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	getSong(data: any) {
		let url = environment.url + 'assets/api/audios/getSong.php';
		let params = '&n=' + data.name;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	addRemove(data: any) {
		let url = environment.url + 'assets/api/audios/addRemove.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	updateReplays(data: any) {
		let url = environment.url + 'assets/api/audios/updateReplays.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	defaultPlaylists(data: any) {
		let url = environment.url + 'assets/api/audios/defaultPlaylists.php';
		let params =	(data.user ? ('&user=' + data.user) : '') +
						(data.session ? ('&session=' + data.session) : '') +
						'&type=' + data.type;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	defaultPlaylistSongs(data: any) {
		let url = environment.url + 'assets/api/audios/defaultPlaylistSongs.php';
		let params =	'&id=' + data.id;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	createPlaylist(data: any) {
		let url = environment.url + 'assets/api/audios/createPlaylist.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res;
			}));
	}

	addRemovePlaylist(data: any) {
		let url = environment.url + 'assets/api/audios/addRemovePlaylist.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}

	publicPrivate(data: any) {
		let url = environment.url + 'assets/api/audios/publicPrivate.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => { 
				return res.json();
			}));
	}
}
