// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// Common
export const environment = {
	production: false,
	url: './',
	name: 'Outroo',
	copyright: '© ' + new Date().getFullYear() + ' Outroo',
	cuantity: 30,
	avatar: './assets/images/user/default/avatar.png',
	background: './assets/images/user/default/background.jpg',
	pathPhotos: './assets/media/photos/',
	pathVideos: './assets/media/videos/',
	pathAudios: './assets/media/audios/',
	language: 1,
	reCaptcha: '6Lc8UokUAAAAAFvc4FVu2WttNqdg1rep7UMx4pJG',
	authHash: 'xQ3s1RVrSR'
};
