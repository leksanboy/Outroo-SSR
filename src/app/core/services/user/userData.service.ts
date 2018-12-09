import { Injectable, } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HeadersService } from '../headers/headers.service';

declare var global: any;

@Injectable()
export class UserDataService {
	public window: any = global;

	constructor(
		private http: Http,
		private headersService: HeadersService
	) { }

	// Translations
	getTranslations(lang) {
		console.log('lang', lang);
		
		let language;
		switch (lang) {
			case '1': // English
				language = 'en_US';
				break;
			case '2': // Español
				language = 'es_ES';
				break;
			case '3': // Français
				language = 'fr_FR';
				break;
			case '4': // Deutsch
				language = 'de_DE';
				break;
			case '5': // Русский
				language = 'ru_RU';
				break;
			default: // By default set English
				language = 'en_US';
				break;
		}

		return this.http.get(environment.url + 'assets/langs/' + language + '.json')
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	login(username, password) {
		let url = environment.url + 'assets/api/user/authenticate.php';
		let params = {
			username: username,
			password: password
		};

		// Reset storage data
		this.logout();

		// Call api
		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				this.setSessionData('login', res.json());
				return res.json();
			}));
	}

	loginNewSession(username, password) {
		let url = environment.url + 'assets/api/user/authenticate.php';
		let params = {
			username: username,
			password: password
		};

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	logout() {
		this.window.localStorage.removeItem('userData_' + environment.authHash);
	}

	setSessionData(type, data) {
		if (type == 'login') {
			let storageLoginData: any = {
				name: 'Outhroo',
				current: data,
				sessions : []
			};

			console.log('Session:', storageLoginData);

			storageLoginData.sessions.push(data);
			this.window.localStorage.setItem('userData_' + environment.authHash, JSON.stringify(storageLoginData));
		} else if (type == 'update') {
			let oldData = this.getSessionData();
			let storageUpdateData: any = {
				name: 'Outhroo',
				current: data,
				sessions: []
			};

			for (let i in oldData.sessions)
				if (oldData.sessions[i].id == data.id){
					data.authorization = oldData.sessions[i].authorization;
					storageUpdateData.sessions.push(data);
				} else {
					storageUpdateData.sessions.push(oldData.sessions[i]);
				}

			this.window.localStorage.setItem('userData_' + environment.authHash, JSON.stringify(storageUpdateData));
			
			return this.getSessionData();
		} else if (type == 'data') {
			this.window.localStorage.setItem('userData_' + environment.authHash, JSON.stringify(data));

			return this.getSessionData();
		}
	}

	getSessionData() {
		if (this.window.localStorage) {
			let data = this.window.localStorage.getItem('userData_' + environment.authHash);
			
			return JSON.parse(data);
		}
	}

	getUserData(id) {
		let url = environment.url + 'assets/api/user/getUser.php';
		let params = 	'&id=' + id;
		params = params.replace('&', '?');

		return this.http.get(url + params)
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	// Updates
	updateData(data) {
		let url = environment.url + 'assets/api/user/updateData.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updateTheme(data) {
		let url = environment.url + 'assets/api/user/updateTheme.php';
		let params = {
			id: data.id,
			theme: data.theme
		};

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updateLanguage(data) {
		let url = environment.url + 'assets/api/user/updateLanguage.php';
		let params = {
			id: data.id,
			language: data.language
		};

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updatePrivate(data) {
		let url = environment.url + 'assets/api/user/updatePrivate.php';
		let params = {
			id: data.id,
			private: data.private
		};

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updatePassword(data) {
		let url = environment.url + 'assets/api/user/updatePassword.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	updateAvatar(data) {
		let url = environment.url + 'assets/api/user/updateAvatar.php';
		let params = {
			id: data.id,
			avatar: data.image
		};

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updateBackground(data) {
		let url = environment.url + 'assets/api/user/updateBackground.php';
		let params = {
			id: data.id,
			background: data.image
		};

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	// Web pages
	checkUsername(username) {
		let url = environment.url + 'assets/api/user/checkUsername.php';
		let params = 	'&username=' + username;
		params = params.replace('&', '?');

		return this.http.get(url + params)
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	checkEmail(email) {
		let url = environment.url + 'assets/api/user/checkEmail.php';
		let params = 	'&email=' + email;
		params = params.replace('&', '?');

		return this.http.get(url + params)
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	confirmEmail(data) {
		let url = environment.url + 'assets/api/user/confirmEmail.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	createAccount(data) {
		let url = environment.url + 'assets/api/user/createAccount.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	forgotPassword(email) {
		let url = environment.url + 'assets/api/user/forgotPassword.php';
		let params = 	'&email=' + email;
		params = params.replace('&', '?');

		return this.http.get(url + params)
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	resetPassword(data) {
		let url = environment.url + 'assets/api/user/resetPassword.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	updateResetPassword(data) {
		let url = environment.url + 'assets/api/user/updateResetPassword.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	setVisitor(data) {
		let url = environment.url + 'assets/api/user/setVisitor.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	noSessionData(){
		this.window.location.href = 'https://outhroo.com/';
	}

	supportQuestion(data) {
		let url = environment.url + 'assets/api/user/supportQuestion.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	report(data) {
		let url = environment.url + 'assets/api/user/report.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	searchMentions(data){
		let url = environment.url + 'assets/api/user/searchMentions.php';
		let params = 	'&caption=' + data.caption + 
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.http.get(url + params)
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}
}
