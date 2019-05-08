import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DOCUMENT } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { HeadersService } from '../headers/headers.service';
import { MetaService } from '../seo/meta.service';
import { SsrService } from '../ssr.service';

import * as moment from 'moment/moment';

declare var ga: Function;
declare var global: any;
declare var navigator: any;

@Injectable()
export class UserDataService {
	public env: any = environment;
	public window: any = global;
	public locale = moment.locale();

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private http: Http,
		private httpClient: HttpClient,
		private headersService: HeadersService,
		private metaService: MetaService,
		private ssrService: SsrService
	) { }

	// Translations
	getTranslations(lang) {
		if (!lang) {
			// Get lang from cookie
			let langCookie = this.getLang('get', null);

			if (!langCookie) {
				// Array of available langs which exists on lang files repo
				const langsArray = ['en', 'es', 'ru'];

				// Detect language
				let langRegion = this.locale;

				// Checking browser lang for validate existing one
				if (!(langsArray.indexOf(langRegion.slice(0, 2)) > -1)) {
					lang = null;
				} else {
					if (langRegion === 'en') {
						lang = 1;
					} else if (langRegion === 'es') {
						lang = 2;
					} else if (langRegion === 'ru') {
						lang = 3;
					}

					this.getLang('set', lang);
				}
			} else {
				lang = langCookie;
			}
		} else {
			this.getLang('set', lang);
		}

		// Lang cases
		let language;
		switch (Number(lang)) {
			case 1: // English
				language = 'en_US';
				break;
			case 2: // Español
				language = 'es_ES';
				break;
			case 3: // Русский
				language = 'ru_RU';
				break;
			case 4: // Deutsch
				language = 'de_DE';
				break;
			case 5: // Français
				language = 'fr_FR';
				break;
			default: // By default set English
				language = 'en_US';
				break;
		}

		return this.http.get(this.env.url + 'assets/i18n/' + language + '.json', this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	getLang(type, lang) {
		if (this.ssrService.isBrowser) {
			if (type === 'set') {
				this.window.localStorage.setItem('lang_' + this.env.authHash, JSON.stringify(lang));
			} else if (type === 'get') {
				return this.window.localStorage.getItem('lang_' + this.env.authHash);
			}
		}
	}

	analytics(url) {
		if (this.ssrService.isBrowser) {
			ga('set', 'page', url);
			ga('send', 'pageview');
		}
	}

	cookies(type) {
		if (this.ssrService.isBrowser) {
			if (type === 'check') {
				return this.window.localStorage.getItem('cookies_' + this.env.authHash);
			} else if (type === 'set') {
				const c = Math.floor(Math.random());
				this.window.localStorage.setItem('cookies_' + this.env.authHash, JSON.stringify(c));
			}
		}
	}

	login(username, password) {
		let url = this.env.url + 'assets/api/user/authenticate.php';
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
		let url = this.env.url + 'assets/api/user/authenticate.php';
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
		if (this.ssrService.isBrowser) this.window.localStorage.removeItem('userData_' + this.env.authHash);
	}

	setSessionData(type, data) {
		if (type == 'login') {
			let storageLoginData: any = {
				name: 'O',
				current: data,
				sessions : []
			};

			storageLoginData.sessions.push(data);
			if (this.ssrService.isBrowser) this.window.localStorage.setItem('userData_' + this.env.authHash, JSON.stringify(storageLoginData));
		} else if (type == 'update') {
			let oldData = this.getSessionData();
			let storageUpdateData: any = {
				name: 'O',
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

			if (this.ssrService.isBrowser)
				this.window.localStorage.setItem('userData_' + this.env.authHash, JSON.stringify(storageUpdateData));
			
			return this.getSessionData();
		} else if (type == 'data') {
			if (this.ssrService.isBrowser)
				this.window.localStorage.setItem('userData_' + this.env.authHash, JSON.stringify(data));

			return this.getSessionData();
		}
	}

	getSessionData() {
		if (this.ssrService.isBrowser && this.window.localStorage) {
			const data = this.window.localStorage.getItem('userData_' + this.env.authHash);
			return JSON.parse(data);
		}
	}

	getUserData(id: any) {
		let url = this.env.url + 'assets/api/user/getUser.php';
		let params = '&id=' + id;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	// Updates
	updateData(data) {
		let url = this.env.url + 'assets/api/user/updateData.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updateTheme(data) {
		let url = this.env.url + 'assets/api/user/updateTheme.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updateLanguage(data) {
		let url = this.env.url + 'assets/api/user/updateLanguage.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updatePrivate(data) {
		let url = this.env.url + 'assets/api/user/updatePrivate.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updatePassword(data) {
		let url = this.env.url + 'assets/api/user/updatePassword.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	updateAvatar(data) {
		let url = this.env.url + 'assets/api/user/updateAvatar.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	updateBackground(data) {
		let url = this.env.url + 'assets/api/user/updateBackground.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return this.setSessionData('update', res.json());
			}));
	}

	// Web pages
	checkUsername(username) {
		let url = this.env.url + 'assets/api/user/checkUsername.php';
		let params = 	'&username=' + username;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	checkEmail(email) {
		let url = this.env.url + 'assets/api/user/checkEmail.php';
		let params = 	'&email=' + email;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	confirmEmail(data) {
		let url = this.env.url + 'assets/api/user/confirmEmail.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	createAccount(data) {
		let url = this.env.url + 'assets/api/user/createAccount.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	forgotPassword(email) {
		let url = this.env.url + 'assets/api/user/forgotPassword.php';
		let params = 	'&email=' + email;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	resetPassword(data) {
		let url = this.env.url + 'assets/api/user/resetPassword.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	updateResetPassword(data) {
		let url = this.env.url + 'assets/api/user/updateResetPassword.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	setVisitor(data) {
		let url = this.env.url + 'assets/api/user/setVisitor.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	noSessionData() {
		if (this.ssrService.isBrowser)
			this.window.location.href = '/';
	}

	supportQuestion(data) {
		let url = this.env.url + 'assets/api/user/supportQuestion.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	report(data) {
		let url = this.env.url + 'assets/api/user/report.php';
		let params = data;

		return this.http.post(url, params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}

	searchMentions(data){
		let url = this.env.url + 'assets/api/user/searchMentions.php';
		let params = 	'&caption=' + data.caption + 
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.http.get(url + params, this.headersService.getHeaders())
			.pipe(map((res: Response) => {
				return res.json();
			}));
	}
}
