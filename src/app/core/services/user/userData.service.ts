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
			lang = this.getLang('get', null);
		} else {
			this.getLang('set', lang);
		}

		// Lang cases
		let language, htmlLang;
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
		}

		// Set moment locale
		this.momentService.setData(htmlLang);

		// Set html lang attr
		this.metaService.setHtmlLang(htmlLang);

		return this.httpClient.get(this.env.urlCdn + 'common/i18n/' + language + '.json', this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	getLang(type, lang) {
		if (this.ssrService.isBrowser) {
			if (type === 'set') {
				this.window.localStorage.setItem('lang', lang);
			} else if (type === 'get') {
				lang = this.window.localStorage.getItem('lang');

				if (!lang) {
					// Detect language
					let navigatorLang = this.window.navigator.language;
					let langRegion = navigatorLang ? navigatorLang : null;

					// Checking browser lang for validate existing one
					const langsArray = ['en', 'es', 'ru'];
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

					return lang;
				} else {
					return lang;
				}
			}
		}
	}

	analytics(page, title, userId) {
		if (this.ssrService.isBrowser) {
			/* ga('create', 'UA-90068205-1', 'auto');

			ga('send', {
				'hitType': 'pageview',
				'page': page,
				'title': title,
				'userId': userId
			}); */
		}
	}

	cookies(type) {
		if (this.ssrService.isBrowser) {
			if (type === 'check') {
				let check = this.window.localStorage.getItem('cookies');
				return check ? false : true;
			} else if (type === 'set') {
				this.window.localStorage.setItem('cookies', true);
			}
		}
	}

	login(data) {
		const url = this.env.urlApi + 'user/authenticate.php';
		const params: any = {
			type: data.type,
			username: data.username,
			password: data.password
		};

		// Facebook and Google login
		if (data.type === 'facebook' || data.type === 'google') {
			params.id = data.id;
			params.name = data.name;
			params.email = data.email;
			params.avatar = data.avatar;
			params.lang = data.lang;
		}

		// Reset storage data
		this.logout();

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				this.setSessionData('login', res);
				return res;
			}));
	}

	loginNewSession(data) {
		const url = this.env.urlApi + 'user/authenticate.php';
		const params = {
			type: (data.type ? data.type : 'normal'),
			username: data.username,
			password: data.password
		};

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	logout() {
		if (this.ssrService.isBrowser) {
			this.window.localStorage.removeItem('userData');
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
				this.window.localStorage.setItem('userData', JSON.stringify(storageLoginData));
			}
		} else if (type === 'update') {
			const oldData = this.getSessionData();
			const storageUpdateData: any = {
				name: 'O',
				current: data,
				sessions: []
			};

			for (const i in oldData.sessions) {
				if (oldData.sessions[i]) {
					if (oldData.sessions[i].id === data.id) {
						data.authorization = oldData.sessions[i].authorization;
						storageUpdateData.sessions.push(data);
					} else {
						storageUpdateData.sessions.push(oldData.sessions[i]);
					}
				}
			}

			if (this.ssrService.isBrowser) {
				this.window.localStorage.setItem('userData', JSON.stringify(storageUpdateData));
			}

			return this.getSessionData();
		} else if (type === 'data') {
			if (this.ssrService.isBrowser) {
				this.window.localStorage.setItem('userData', JSON.stringify(data));
			}

			return this.getSessionData();
		}
	}

	getSessionData() {
		if (this.ssrService.isBrowser && this.window.localStorage) {
			const data = this.window.localStorage.getItem('userData');
			return JSON.parse(data);
		}
	}

	getUserData(id) {
		const url = this.env.urlApi + 'user/getUser.php';
		let params = '&id=' + id;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	updateData(data) {
		const url = this.env.urlApi + 'user/update.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return this.setSessionData('update', res);
			}));
	}

	checkUsername(username) {
		const url = this.env.urlApi + 'user/checkUsername.php';
		let params = 	'&username=' + username;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	checkEmail(email) {
		const url = this.env.urlApi + 'user/checkEmail.php';
		let params = 	'&email=' + email;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	confirmEmail(data) {
		const url = this.env.urlApi + 'user/confirmEmail.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	createAccount(data) {
		const url = this.env.urlApi + 'user/createAccount.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	forgotPassword(data) {
		const url = this.env.urlApi + 'user/forgotPassword.php';
		let params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	resetPassword(data) {
		const url = this.env.urlApi + 'user/resetPassword.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	updateResetPassword(data) {
		const url = this.env.urlApi + 'user/updateResetPassword.php';
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
		const url = this.env.urlApi + 'user/supportQuestion.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	report(data) {
		const url = this.env.urlApi + 'user/report.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	searchMentions(data) {
		const url = this.env.urlApi + 'user/searchMentions.php';
		let params = 	'&caption=' + data.caption +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	setLocalStotage(name, data) {
		if (this.ssrService.isBrowser) {
			this.window.localStorage.setItem(name, JSON.stringify(data));
		}
	}

	getLocalStotage(name) {
		if (this.ssrService.isBrowser) {
			if (this.window.localStorage) {
				const data = this.window.localStorage.getItem(name);
				return JSON.parse(data);
			} else {
				return null;
			}
		}
	}

	getRecommended(data) {
		const url = this.env.urlApi + 'user/getRecommended.php';
		let params = 	'&user=' + data.user +
						'&cuantity=' + data.cuantity;
		params = params.replace('&', '?');

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	dismissRecommended(data) {
		const url = this.env.urlApi + 'user/dismissRecommended.php';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
}
