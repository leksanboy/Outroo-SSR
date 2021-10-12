// Common
export const environment = {
	production: true,
	url: 'https://beatfeel.com/',
	urlCookie: '.beatfeel.com',
	name: 'Beatfeel',
	copyright: '© ' + new Date().getFullYear() + ' Beatfeel',
	cuantity: 30,
	/* audioMimeTypes: 'audio/ac3, audio/aac, audio/basic, audio/amr, audio/dsd, audio/dts, audio/flac, audio/midi, audio/x-monkeys-audio, audio/it, audio/xm, audio/s3m, audio/x-musepack, audio/mpeg, audio/mp4, audio/voc, audio/x-realaudio, audio/m4a, audio/x-m4a', */
	audioMimeTypes: 'audio/mpeg, audio/mp4',
	photoMimeType: '.jpg, .jpeg, .png, .gif, .bmp, .tiff, image/jpeg, image/png, image/gif, image/heic, image/heif, image/webp, video/*, .avi, .mp4, .3gp, .mpeg, .mov, .flv, .f4v, .wmv, .mkv, .webm, .vob, .rm, .rmvb, .m4v, .mpg, .ogv, .ts, .m2ts, .mts, .mxf',
	image: 'https://beatfeel.com/assets/images/icons/square/icon-512x512.png',
	avatar: 'https://beatfeel.com/assets/images/user/default/avatar.png',
	background: 'https://beatfeel.com/assets/images/user/default/background.jpg',
	pathPhotos: 'https://beatfeel.com/assets/media/photos/',
	pathVideos: 'https://beatfeel.com/assets/media/videos/',
	pathAudios: 'https://beatfeel.com/assets/media/audios/',
	defaultSongCover: 'https://beatfeel.com/assets/images/default_song.png',
	defaultPlaylistCover: 'https://beatfeel.com/assets/images/default_playlist.png',
	defaultPostImage: 'https://beatfeel.com/assets/images/default_post.png',
	language: 1,
	reCaptcha: '6Lf8hTkbAAAAAKcIPskHrfPWeljb_0Wx87UeJOAp',
	authHash: 'xQ3s1RVrSR',
	ad: '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5692822538817681" data-ad-slot="5300728600" data-ad-format="auto" data-full-width-responsive="true"></ins>',
	emailPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	urlRegex: /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g,
	defaultPage: 'news',
	contentLengthLimit: 300,
	maxFileSize: 50000000, // 50Mb
	maxItemsPerUpload: 100
};
