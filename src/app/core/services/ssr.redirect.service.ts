import { Inject, Injectable, Optional, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RESPONSE, REQUEST } from '@nguniversal/express-engine/tokens';
import { Response, Request } from 'express';

interface IRenderModuleFactoryRedirect {
	need: boolean;
	code: number;
	url: string;
};

@Injectable()
export class SsrRedirectService {

	constructor(@Inject(PLATFORM_ID) private platformId: Object,
				@Inject(Injector) private injector: Injector,
				@Optional() @Inject('REDIRECT_CONFIG') protected REDIRECT_CONFIG: {[key: string]: IRenderModuleFactoryRedirect}|null) {};

	public setStatus(code: number, message: string): void {
		if (!isPlatformBrowser(this.platformId)) {

			const REQ: Request = this.injector.get(REQUEST) as Request;
			const RES: Response = this.injector.get(RESPONSE) as Response;

			RES.statusCode = code;
			RES.statusMessage = message;
		};
	};

	public redirectWithStatus(code: number, message: string, url: string): void {
		if (!isPlatformBrowser(this.platformId)) {

			this.setStatus(code, message);

			this.REDIRECT_CONFIG.config = {
				need: true,
				code: code,
				url: url,
			};
		};
	};
};
