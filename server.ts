// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

import { ngExpressEngine } from '@nguniversal/express-engine'; 			    // Express Engine
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { renderModuleFactory } from '@angular/platform-server';			        // Import module map for lazy loading
// Interfaces
import { ValueProvider } from '@angular/core';

// const asyncForEach = require('./node/utils/asyncForEach');


// const IS_RELEASE = true;				// robots.txt

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModule, AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

const fs = require('fs');

const app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT || 4000;
const DIST_FOLDER =                         join(process.cwd(), 'dist');
const DIST_BROWSER_FOLDER: string =         join(DIST_FOLDER, 'browser');
const DIST_BROWSER_ASSETS_FOLDER: string =  join(DIST_BROWSER_FOLDER, 'assets');
const INDEX_HTML_PATH: string =             join(DIST_BROWSER_FOLDER, 'index.html');
const INDEX_HTML: string =                  fs.readFileSync(INDEX_HTML_PATH).toString();

enableProdMode();   // Faster server renders w/ Prod mode (dev mode never needed)

// //////////////////////////////////////////////////////////////////////// Run

function postPrerenderMinimize(html: string): string {
    return html.replace(/\r\n/gm, ``).replace(/\n/gm, ``).replace(/\r/gm, ``).replace(/\t/gm, ``).replace(/<!---->/gm, ``);
}

app.engine('html', (_, options, callback) => {
    const RC = {config: {need: false, code: null, url: null}};

    console.log(`renderModuleFactory: `, options.req.url);

    renderModuleFactory(AppServerModuleNgFactory || AppServerModule, {
        document: INDEX_HTML,
        url: options.req.url,
        extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP),
            <ValueProvider> { provide: REQUEST, useValue: options.req },
            <ValueProvider> { provide: RESPONSE, useValue: options.res },
            <ValueProvider> { provide: `REQUEST_MODE`, useValue: `USER-REQUEST` },
            <ValueProvider> { provide: `REDIRECT_CONFIG`, useValue: RC }
        ]
    })
    .then((html: string) => {
        if (RC.config.need) {
            console.log(`REDIRECT_CONFIG: `, RC.config);
            options.res.redirect(RC.config.code, RC.config.url);
        } else {
            console.log(`Pre-rendering successful :: ${options.req.url}`);
            // console.log(html);
            callback(null, postPrerenderMinimize(html));
        }
    }).catch((error: any) => {
        console.error('Error occurred:', error);
    });
});

app.set('view engine', 'html');
app.set('views', DIST_BROWSER_FOLDER);

app.use('*/favicon.ico', express.static('dist/browser/favicon.ico'));
// app.use('*/robots.txt', express.static(`dist/browser/assets/seo/${IS_RELEASE ? `release` : `preview`}/robots.txt`));

app.get('/assets/*', express.static(DIST_BROWSER_ASSETS_FOLDER));
app.get('*/swiper.component.css.map$', (req: express.Request, res: express.Response) => res.end());
app.get('*/null$', (req: express.Request, res: express.Response) => res.end());

// Server static files from /browser
app.get('*.*', express.static(DIST_BROWSER_FOLDER));

// NO checked urls with "." & "assets" fragments
// checked: %
app.get(/.*/, function(req: express.Request, res: express.Response, next: Function) {

    if (/\.|assets*/g.test(req.originalUrl) || !/%/g.test(req.originalUrl)) {
        next();
        return;
    }

    const REDIRECT_URL = `${req.protocol}://${req.headers.host}${req.originalUrl.replace(/%/g, ``)}`;

    console.log(`301 Redirect [RETRIEVAL %] :: ${REDIRECT_URL}`);

    res.redirect(301, REDIRECT_URL);
});

// All regular routes use the Universal engine
app.get('*', (req: express.Request, res: express.Response, next: Function) => {

    if (!req.originalUrl.includes(`404.html`) && !/\?\w+=/.test(req.originalUrl) && /\.|assets*/g.test(req.originalUrl)) {
        console.log(`404 Not Found :: ${req.originalUrl}`);
        res.status(404).send('Not Found');
        return;
    }

    console.log(`Universal engine * ${req.protocol}://${req.get('host')}${req.originalUrl}`);

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');

    res.render(INDEX_HTML_PATH, {
        req,
        res,
        providers: [
            <ValueProvider> { provide: REQUEST, useValue: req },
            <ValueProvider> { provide: RESPONSE, useValue: res },
            <ValueProvider> { provide: `REQUEST_MODE`, useValue: `USER-REQUEST` },
            <ValueProvider> { provide: `REDIRECT_CONFIG`, useValue: null }
        ],
    });
});

// Start up the Node server
app.listen(PORT, () => console.log(`Node server listening: PORT: ${PORT}`));
