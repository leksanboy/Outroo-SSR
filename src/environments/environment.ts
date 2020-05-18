// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// Common
export const environment = {
	production: false,
	url: 'https://outroo.com/',
	urlCookie: '.outroo.com',
	name: 'Outroo',
	copyright: '© ' + new Date().getFullYear() + ' Outroo',
	cuantity: 30,
	/* audioMimeTypes: 'audio/ac3, audio/aac, audio/basic, audio/amr, audio/dsd, audio/dts, audio/flac, audio/midi, audio/x-monkeys-audio, audio/it, audio/xm, audio/s3m, audio/x-musepack, audio/mpeg, audio/mp4, audio/voc, audio/x-realaudio, audio/m4a, audio/x-m4a', */
	audioMimeTypes: 'audio/mpeg, audio/mp4',
	photoMimeType: '.jpg, .jpeg, .png, .gif, .bmp, .tiff, image/jpeg, image/png, image/gif, image/heic, image/heif, image/webp, video/*, .avi, .mp4, .3gp, .mpeg, .mov, .flv, .f4v, .wmv, .mkv, .webm, .vob, .rm, .rmvb, .m4v, .mpg, .ogv, .ts, .m2ts, .mts, .mxf',
	image: 'https://outroo.com/assets/images/icons/square/icon-512x512.png',
	avatar: 'https://outroo.com/assets/images/user/default/avatar.png',
	background: 'https://outroo.com/assets/images/user/default/background.jpg',
	pathPhotos: 'https://outroo.com/assets/media/photos/',
	pathVideos: 'https://outroo.com/assets/media/videos/',
	pathAudios: 'https://outroo.com/assets/media/audios/',
	defaultSongCover: './assets/images/default_song_cover1.png',
	defaultPlaylistCover: './assets/images/default_song_cover1.png',
	defaultPostImage: './assets/images/default_song_cover1.png',
	language: 1,
	reCaptcha: '6Lc8UokUAAAAAFvc4FVu2WttNqdg1rep7UMx4pJG',
	authHash: 'xQ3s1RVrSR',
	ad: '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5692822538817681" data-ad-slot="1488875790" data-ad-format="auto" data-full-width-responsive="true"></ins>',
	emailPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	urlRegex: /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g,
	defaultPage: 'news',
	contentLengthLimit: 300,
	maxFileSize: 50000000, // 50Mb
	maxItemsPerUpload: 100
};
