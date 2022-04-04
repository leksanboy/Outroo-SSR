----------------------------------------------------------------------------------------------------

# Beatfeel

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.1.

----------------------------------------------------------------------------------------------------

## Run locally

ng s --port 4400 -o

## Buiild to SSH

<!-- 0. Super admin -->
sudo su

<!-- 1. Compile for distribution -->
# npm run build:ssr && rm -rf dist/browser/assets/ && rm -rf distNew && mv dist distNew
npm run build:ssr && rm -rf dist/browser/assets

<!-- 2. Open SSH Console (Google GCP) -->
ir al navegador y seleccionar en marcadores ssh

<!-- 3. Upload new + Stop Old + Launch new + Start new + Remove old -->
cd /var/www/beatfeel.com/ && sudo mv distNew dist && pm2 start dist/server.js
cd /var/www/beatfeel.com/public_html/ && pm2 stop 0 && pm2 delete 0 && sudo mv dist distOld && sudo mv distNew dist && pm2 start dist/server.js && sudo rm -rf distOld/

----------------------------------------------------------------------------------------------------

## ADDITIONAL CODE

### Complete Steps from Angular Universal
[Angular Universal](https://angular.io/guide/universal)

### Add to polyfills.ts
(window as any).global = window;

### Install Packages
sudo su
npm i ts-md5 moment cropperjs ng-recaptcha angular2-useful-swiper ngx-device-detector
npm i --save @angular/material @angular/cdk @angular/animations @angular/http hammerjs
