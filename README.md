----------------------------------------------------------------------------------------------------

# Outroo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.1.

----------------------------------------------------------------------------------------------------

# Build PROD

<!-- [For GoogleCloudPlatform] -->
npm run build:ssr && rm -rf dist/browser/assets/

<!-- [compile & run on localhost] -->
npm run build:ssr && npm run serve:ssr

<!-- Cloud SSH -->
cd /var/www/html/ && pm2 stop 0 && pm2 delete 0 && sudo rm -rf dist/
pm2 start dist/server.js

----------------------------------------------------------------------------------------------------

# ADDITIONAL CODE

## Complete Steps from Angular Universal
[Angular Universal](https://angular.io/guide/universal)

## Add to polyfills.ts
(window as any).global = window;

## Install Packages
sudo su
npm i ts-md5 moment cropperjs ng-recaptcha angular2-useful-swiper ngx-device-detector
npm i --save @angular/material @angular/cdk @angular/animations @angular/http hammerjs

----------------------------------------------------------------------------------------------------
