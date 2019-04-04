import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class SsrService {
	public isBrowser: boolean;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.isBrowser = isPlatformBrowser(platformId);
    };
};
