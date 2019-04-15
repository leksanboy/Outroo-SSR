import { Injectable, Inject } from '@angular/core';
import { DOCUMENT, Title, Meta } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import ISeoData from '../interfaces/seo.data';
import { SsrService } from './ssr.service';
import { SessionService } from './session/session.service';
import { Subscription } from 'rxjs';
import { STATIC_SEO_DATA } from '../../@DATA/static.seo.config';

const LANGUAGES: string[] = [`es`, `ru`, `en`];

const MATHING_CONTETNT_LANG: {[key: string]: string} = {
	'ru': `ru-RU`,
	'en': `en-US`,
	'es': `xx-XX`// ????
};

@Injectable()
export class SeoService {
	private hrefOrigin: string;
    private image: string;
    private subsLang: Subscription;
	private environment: any = environment;

	constructor(@Inject(DOCUMENT) private document,
				private meta: Meta,
				private titleService: Title,
                private sessionService: SessionService,
                private ssrService: SsrService,) {
		this.hrefOrigin = this.ssrService.isBrowser ? this.document.location.origin : this.environment.url;
	}

	public updateMeta(page: string, currentUrl: string): void {
		const SD: ISeoData = STATIC_SEO_DATA.find((sd: ISeoData) => sd.page === page);
        if (!SD) {
            console.log(`Not found SeoData for page: ${page}`); 
            return; 
        };

        const LANG: string = `en`; // ru | en | es

        // let LANG: string = `ru`; // ru | en
        // this.subsLang = this.sessionService.getDataLanguage().subscribe((data: any) => {
        //     this.subsLang.unsubscribe();
        //     LANG = data.current.language;
        // });

		const LOCATION: string = this.concateLocation(this.hrefOrigin, LANG, currentUrl);
		const CANONICAL_URL: string = LOCATION;

		if (this.ssrService.isBrowser) {
			console.groupCollapsed(`%c SeoService.update()`, 'color:purupre;font-size:12px;');
			console.log(SD);
			console.groupEnd();
		} else {
            console.log(`SEO Service`);
            console.log(`LANG: ${LANG}`);
            console.log(`page: ${page}`);
            console.log(`SeoData: ${SD}`);
        }
		this.removeTags();
		
        // <html lang="...">
		this.document.documentElement.lang = MATHING_CONTETNT_LANG[LANG];

		// <title>
		this.titleService.setTitle(SD.title[LANG]);

		// <meta name="description" itemprop="description" content="...">
        this.meta.addTag({name: 'description',  itemprop: 'description', content: SD.description[LANG]});

		// <meta name="keywords" itemprop="keywords" content="...">
		this.meta.addTag({name: 'keywords',  itemprop: 'keywords', content: SD.keywords[LANG]});
		
        // <meta itemprop="image" content="...">
		this.meta.addTag({itemprop: 'image', content: `${this.hrefOrigin}${SD.image}`});

        // <meta httpequiv="Content-Language" content="...">
		this.meta.addTag({httpEquiv: 'Content-Language',  content: MATHING_CONTETNT_LANG[LANG]});

		// <meta name="robots" content="...">
		// this.meta.addTag({name: 'robots',  content: `noindex,follow`});

		// <link hreflang="..." rel="alternate" href="...">
		LANGUAGES.forEach((lang: string) => {
			if (lang === LANG) {
				// const L = this.document.createElement('link');
				// L.setAttribute('rel', 'alternate');
				// L.setAttribute('hreflang', `x-default`);
				// L.setAttribute('href', this.concateLocation(this.hrefOrigin, `ru`, currentUrl));
				// this.document.head.appendChild(L);
				return;
			};
			const L = this.document.createElement('link');
			L.setAttribute('rel', 'alternate');
			L.setAttribute('hreflang', lang);
			L.setAttribute('href', this.concateLocation(this.hrefOrigin, lang, currentUrl));
			this.document.head.appendChild(L);
		});

        // <link rel="canonical" href="..."/>
        const linkCanonicalElement = this.document.createElement('link');
        linkCanonicalElement.setAttribute('rel', 'canonical');
        linkCanonicalElement.setAttribute('href', CANONICAL_URL);
		this.document.head.appendChild(linkCanonicalElement);
		
		// <meta property="og:..." content="...">
		this.meta.addTag({property: 'og:title',  content: SD.title[LANG]});
        this.meta.addTag({property: 'og:url',  content: LOCATION});
        this.meta.addTag({property: 'og:image',  content: this.image});
        this.meta.addTag({property: 'og:site_name',  content: `Outroo`});
        this.meta.addTag({property: 'og:description',  content: SD.description[LANG]});

		// <meta property="twitter:..." content="...">
        this.meta.addTag({property: 'twitter:card',  content: `summary`});
        this.meta.addTag({property: 'twitter:site',  content: `@outroo`});
        this.meta.addTag({property: 'twitter:title',  content: SD.title[LANG]});
        this.meta.addTag({property: 'twitter:description',  content: SD.description[LANG]});
        this.meta.addTag({property: 'twitter:image',  content: this.image});
    }
    
    private concateLocation(origin: string, lang: string, url: string): string {
        return `${origin}${lang === `ru` ? `` : `/${lang}`}${url}`;
    }

	private removeTags(): void {
		// this.meta.removeTag('name="title"');
        this.meta.removeTag('name="description"');
        this.meta.removeTag('name="keywords"');
        this.meta.removeTag('name="robots"');
        this.meta.removeTag('itemprop="image"');
        this.meta.removeTag('httpEquiv="Content-Language"');

        this.meta.removeTag('property="og:title"');
        this.meta.removeTag('property="og:url"');
        this.meta.removeTag('property="og:image"');
        this.meta.removeTag('property="og:site_name"');
        this.meta.removeTag('property="og:description"');
        // this.meta.removeTag('property="og:type"');
        // this.meta.removeTag('property="article:published_time"');
        // this.meta.removeTag('property="article:modified_time"');

        this.meta.removeTag('property="twitter:card"');
        this.meta.removeTag('property="twitter:site"');
        this.meta.removeTag('property="twitter:title"');
        this.meta.removeTag('property="twitter:description"');
        this.meta.removeTag('property="twitter:image"');

        LANGUAGES.forEach((lang: string) => {
            const L: Element = this.document.head.querySelector(`link[hreflang="${lang}"]`);
            if (L) this.document.head.removeChild(L);
        });

		// const hlX: Element = this.document.head.querySelector(`link[hreflang="x-default"]`);
		// !!hlX ? this.document.head.removeChild(hlX) : null;

        const canonicalElem: Element = this.document.head.querySelector(`link[rel="canonical"]`);
        !!canonicalElem ? this.document.head.removeChild(canonicalElem) : null;
	}
}
