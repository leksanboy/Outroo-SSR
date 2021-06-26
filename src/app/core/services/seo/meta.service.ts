import { Title, Meta } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class MetaService {
	constructor(
		@Inject(DOCUMENT) private document: Document,
		private title: Title,
		private meta: Meta
	) {}

	setData(data) {
		// Set title
		this.title.setTitle(data.page);

		// Meta tags
		this.meta.updateTag({ name: 'title', 				content: data.title, 			property: 'title'			});
		this.meta.updateTag({ name: 'description', 			content: data.description, 		property: 'description' 	});
		this.meta.updateTag({ name: 'keywords', 			content: data.keywords, 		property: 'keywords'		});
		this.meta.updateTag({ itemtype: data.url 																		});

		// Twitter
		this.meta.updateTag({ name: 'twitter:card',			content: 'summary' 											});
		this.meta.updateTag({ name: 'twitter:site',			content: '@beatfeel1' 										});
		this.meta.updateTag({ name: 'twitter:title',		content: data.title 										});
		this.meta.updateTag({ name: 'twitter:description',	content: data.description 									});
		this.meta.updateTag({ name: 'twitter:image', 		content: data.image 										});

		// Open Graph protocol
		this.meta.updateTag({ property: 'og:type',			content: 'article' 											});
		this.meta.updateTag({ property: 'og:site_name', 	content: 'Beatfeel' 										});
		this.meta.updateTag({ property: 'og:title', 		content: data.title 										});
		this.meta.updateTag({ property: 'og:description',	content: data.description 									});
		this.meta.updateTag({ property: 'og:image', 		content: data.image 										});
		this.meta.updateTag({ property: 'og:url', 			content: data.url 											});

		// Canonical url
		this.meta.updateTag({ rel: 'canonical', 			href: data.url 												});
	}

	setHtmlLang(lang) {
		const html = this.document.documentElement;
		html.setAttribute('lang', lang);
	}
}
