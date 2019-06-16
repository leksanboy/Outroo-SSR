import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HeadersService } from '../headers/headers.service';
import { MetaService } from '../seo/meta.service';
import { MomentService } from '../moment/moment.service';
import { SsrService } from '../ssr.service';

import * as moment from 'moment/moment';

declare var global: any;
declare var ga: Function;

@Injectable()
export class UserDataService {
	public env: any = environment;
	public window: any = global;
	public locale = moment.locale();

	constructor(
		private httpClient: HttpClient,
		private headersService: HeadersService,
		private metaService: MetaService,
		private momentService: MomentService,
		private ssrService: SsrService
	) {}

	getTranslations(lang) {
		if (!lang) {
			// Get lang from cookie
			const langCookie = this.getLang('get', null);

			if (!langCookie) {
				// Array of available langs which exists on lang files repo
				const langsArray = ['en', 'es', 'ru'];

				// Detect language
				const langRegion = this.locale;

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
		let htmlLang;
		switch (Number(lang)) {
			default:
			case 1: // English
				language = 'en_US';
				htmlLang = 'en';
				break;
			case 2: // Español
				language = 'es_ES';
				htmlLang = 'es';
				break;
			case 3: // Русский
				language = 'ru_RU';
				htmlLang = 'ru';
				break;
			case 4: // Deutsch
				language = 'de_DE';
				htmlLang = 'de';
				break;
			case 5: // Français
				language = 'fr_FR';
				htmlLang = 'fr';
				break;
		}

		// Set moment locale
		this.momentService.setData(htmlLang);

		// Set html lang attr
		this.metaService.setHtmlLang(htmlLang);

		return this.httpClient.get(this.env.url + 'assets/i18n/' + language + '.json', this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	getLang(type, lang) {
		if (this.ssrService.isBrowser) {
			if (type === 'set') {
				this.window.localStorage.setItem('lang_' + this.env.authHash, lang);
			} else if (type === 'get') {
				return this.window.localStorage.getItem('lang_' + this.env.authHash);
			}
		}
	}

	analytics(url) {
		if (this.ssrService.isBrowser) {
			console.log('analytics 2:', url);

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
		const url = this.env.url + 'assets/api/user/authenticate.php';
		const params = {
			username: username,
			password: password
		};

		// Reset storage data
		this.logout();

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				this.setSessionData('login', res);
				return res;
			}));
	}

	loginNewSession(username, password) {
		const url = this.env.url + 'assets/api/user/authenticate.php';
		const params = {
			username: username,
			password: password
		};

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	logout() {
		if (this.ssrService.isBrowser) {
			this.window.localStorage.removeItem('userData_' + this.env.authHash);
		}
	}

	setSessionData(type, data) {
		if (type === 'login') {
			const storageLoginData: any = {
				name: 'O',
				current: data,
				sessions : []
			};

			storageLoginData.sessions.push(data);

			if (this.ssrService.isBrowser) {
				this.window.localStorage.setItem('userData_' + this.env.authHash, JSON.stringify(storageLoginData));
			}
		} else if (type === 'update') {
			const oldData = this.getSessionData();
			const storageUpdateData: any = {
				name: 'O',
				current: data,
				sessions: []
			};

			for (const i of oldData.sessions) {
				if (i) {
					if (i.id === data.id) {
						data.authorization = i.authorization;
						storageUpdateData.sessions.push(data);
					} else {
						storageUpdateData.sessions.push(oldData.sessions[i]);
					}
				}
			}

			if (this.ssrService.isBrowser) {
				this.window.localStorage.setItem('userData_' + this.env.authHash, JSON.stringify(storageUpdateData));
			}

			return this.getSessionData();
		} else if (type === 'data') {
			if (this.ssrService.isBrowser) {
				this.window.localStorage.setItem('userData_' + this.env.authHash, JSON.stringify(data));
			}

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
		const url = this.env.url + 'assets/api/user/getUser.php';
		let params = '&id=' + id;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	updateData(data) {
		const url = this.env.url + 'assets/api/user/updateData.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return this.setSessionData('update', res);
			}));
	}

	updateTheme(data) {
		const url = this.env.url + 'assets/api/user/updateTheme.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return this.setSessionData('update', res);
			}));
	}

	updateLanguage(data) {
		const url = this.env.url + 'assets/api/user/updateLanguage.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return this.setSessionData('update', res);
			}));
	}

	updatePrivate(data) {
		const url = this.env.url + 'assets/api/user/updatePrivate.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return this.setSessionData('update', res);
			}));
	}

	updatePassword(data) {
		const url = this.env.url + 'assets/api/user/updatePassword.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	updateAvatar(data) {
		const url = this.env.url + 'assets/api/user/updateAvatar.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return this.setSessionData('update', res);
			}));
	}

	updateBackground(data) {
		const url = this.env.url + 'assets/api/user/updateBackground.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return this.setSessionData('update', res);
			}));
	}

	checkUsername(username) {
		const url = this.env.url + 'assets/api/user/checkUsername.php';
		let params = 	'&username=' + username;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	checkEmail(email) {
		const url = this.env.url + 'assets/api/user/checkEmail.php';
		let params = 	'&email=' + email;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	confirmEmail(data) {
		const url = this.env.url + 'assets/api/user/confirmEmail.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	createAccount(data) {
		const url = this.env.url + 'assets/api/user/createAccount.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	forgotPassword(email) {
		const url = this.env.url + 'assets/api/user/forgotPassword.php';
		let params = 	'&email=' + email;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	resetPassword(data) {
		const url = this.env.url + 'assets/api/user/resetPassword.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	updateResetPassword(data) {
		const url = this.env.url + 'assets/api/user/updateResetPassword.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	setVisitor(data) {
		const url = this.env.url + 'assets/api/user/setVisitor.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	noSessionData() {
		if (this.ssrService.isBrowser) {
			this.window.location.href = '/';
		}
	}

	supportQuestion(data) {
		const url = this.env.url + 'assets/api/user/supportQuestion.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	report(data) {
		const url = this.env.url + 'assets/api/user/report.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	searchMentions(data) {
		const url = this.env.url + 'assets/api/user/searchMentions.php';
		let params = 	'&caption=' + data.caption +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
}
