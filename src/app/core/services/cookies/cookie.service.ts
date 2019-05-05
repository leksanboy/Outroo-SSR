// import { Injectable, Inject } from '@angular/core';
// import { DOCUMENT } from "@angular/platform-browser";

// @Injectable()
// export class CookieService {
// 	constructor(
// 		@Inject(DOCUMENT) private document: Document
// 	) {
// 		this.setCookie('_outroo', 'es');

// 		let a = this.getCookie('_outroo');
// 		console.log("a", a);
// 	}

// 	setCookie(name, value) {
// 		let date = new Date();
// 		date.setTime(date.getTime() + (365*24*60*60*1000));
// 		let expires = '; expires=' + date.toUTCString();

// 		this.document.cookie = name + '=' + (value || '')  + expires + '; path=/';
// 	}

// 	getCookie(name) {
// 		let nameEQ = name + '=';
// 		let ca = this.document.cookie.split(';');
		
// 		for (let i = 0; i < ca.length; i++) {
// 			let c = ca[i];
// 			while (c.charAt(0)==' ') c = c.substring(1,c.length);
// 			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
// 		}

// 		return null;
// 	}
// }
