import { DOCUMENT } from '@angular/platform-browser';
import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy, Inject, ElementRef, Renderer } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';

import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { BookmarksDataService } from '../../../../app/core/services/user/bookmarksData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var ga: Function;
declare var global: any;

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class MainComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public swiperConfig: any = {
		pagination: '.swiper-pagination',
		nextButton: '.swiperNext',
		prevButton: '.swiperPrev',
		paginationClickable: true,
		spaceBetween: 0
	};
	public activeRouter: any;
	public activePlayerInformation: any;
	public activeLanguage: any;
	public activeNewPublication: any;
	public activeRouterExists: any;
	public activeSessionPlaylists: any;
	public userExists: boolean = true;
	public data: any;
	public dataDefault: any;
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		public dialog: MatDialog,
		private router: Router,
		private location: Location,
		private renderer: Renderer,
		private elementRef: ElementRef,
		private alertService: AlertService,
		private playerService: PlayerService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private followsDataService: FollowsDataService,
		private bookmarksDataService: BookmarksDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService,
		private metaService: MetaService,
		private ssrService: SsrService,

	) {
		// Set component data
		this.activeRouter = this.router.events
			.subscribe(event => {
				if(event instanceof NavigationEnd) {
					// User data from routing resolve
					this.userData = this.activatedRoute.snapshot.data.userResolvedData;

					if (this.userData)
						this.userExists = true;

					let metaData = {
						page: this.userData.name,
						title: this.userData.name,
						description: this.userData.aboutOriginal,
						keywords: this.userData.aboutOriginal,
						url: this.environment.url + this.userData.username,
						image: this.environment.url + this.userData.avatarUrl
					};
					this.metaService.setData(metaData);

					// Close all dialogs
					this.dialog.closeAll();

					// Run page on routing
					this.activeRouterExists = true;

					// Go top of page on change user
					if (this.ssrService.isBrowser) {
						this.window.scrollTo(0, 0);
					}

					// Get session data
					this.sessionData = this.userDataService.getSessionData();

					// Check if session exists, if not set by default empty data
					if (!this.sessionData) {
						this.sessionData = [];
						this.sessionData.current = {
							id: null
						};
					}

					// Get translations
					this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

					// Update user data if im the user
					if (this.userData.id == this.sessionData.current.id)
						this.sessionData = this.userDataService.setSessionData('update', this.userData);

					// Set Google analytics
					let urlGa =  '[' + this.userData.id + ']/' + this.userData.id + '/main';
					ga('set', 'page', urlGa);
					ga('send', 'pageview');

					// Data following/visitor
					let data = {
						receiver: this.userData.id
					};

					// Set visitor
					this.userDataService.setVisitor(data).subscribe();

					// Get publications
					this.default('default', this.userData.username);
				}
			});

		// Session playlists
		this.activeSessionPlaylists = this.sessionService.getDataPlaylists()
			.subscribe(data => {
				this.sessionData = data;
			});

		// Get current track
		this.activePlayerInformation = this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				let lang = data.current.language;
				this.getTranslations(lang);
			});

		// Get new publication
		this.activeNewPublication = this.sessionService.getDataNewPublication()
			.subscribe(data => {
				this.newPublication('result', data.data);
			});

		// Click on a href
		this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
			if (event.target.localName == 'a')
				this.sessionService.setDataClickElementRef(event);
		});

		// Load more on scroll on bottom
		this.window.onscroll = (event) => {
			let windowHeight = "innerHeight" in this.window ? this.window.innerHeight : document.documentElement.offsetHeight;
			let body = document.body, html = document.documentElement;
			let docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			let windowBottom = windowHeight + this.window.pageYOffset;

			if (windowBottom >= docHeight)
				if (this.dataDefault.list.length > 0)
					this.default('more', null);
		}
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeSessionPlaylists.unsubscribe();
		this.activePlayerInformation.unsubscribe();
		this.activeLanguage.unsubscribe();
		this.activeNewPublication.unsubscribe();
	}

	// Follow / Unfollow
	followUnfollow(type, user){
		if (type == 'follow')
			user.followingStatus = user.private ? 'pending' : 'following';
		else if (type == 'unfollow')
			user.followingStatus = 'unfollow';

		let data = {
			type: user.followingStatus,
			private: user.private,
			receiver: user.id
		}

		this.followsDataService.followUnfollow(data).subscribe();
	}

	// Show user images
	showAvatar(){
		let data = {
			userData: this.userData
		};

		this.sessionService.setDataShowAvatar(data);
	}

	// New publication
	newPublication(type, data){
		if (type === 'new') {
			let opt = {
				type: 'new',
				data: null
			};

			this.sessionService.setDataNewPublication(opt);
		} else if (type === 'result') {
			if (data) {
				this.alertService.publishing(this.translations.main.publishing);

				setTimeout(() => {
					this.dataDefault.list.unshift(data);
					this.dataDefault.noData = false;
				}, 600);
			}
		}
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Play video
	playVideo(item, player){
		player = document.getElementById(player);
		player.load();
		player.play();
		item.playButton = true;

		player.addEventListener('ended', myHandler, false);

		function myHandler(e) {
			item.playButton = false;
		}
	}

	// Default
	default(type, user) {
		if (type == 'default') {
			this.dataDefault = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noData: false,
				noMore: false
			}

			let data = {
				type: 'user',
				user: user,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (!res || res.length == 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataDefault.noData = false;
						this.dataDefault.list = res;
					}

					if (!res || res.length < this.environment.cuantity)
						this.dataDefault.noMore = true;
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				type: 'user',
				user: this.userData.id,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataDefault.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								this.dataDefault.list.push(res[i]);

						if (!res || res.length < this.environment.cuantity)
							this.dataDefault.noMore = true;
					}, 600);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Item options
	itemOptions(type, item){
		switch (type) {
			case "remove":
				item.removeType = item.addRemoveSession ? "add" : "remove";

				let dataAddRemove = {
					id: item.id,
					type: item.removeType
				}

				this.publicationsDataService.addRemove(dataAddRemove).subscribe();
				break;
			case "disableComments":
				item.disabledComments = !item.disabledComments;

				let dataDisableComments = {
					id: item.id,
					type: item.disabledComments
				}

				this.publicationsDataService.enableDisableComments(dataDisableComments).subscribe();
				break;
			case "report":
				item.type = 'publication';
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Share on social media
	shareOn(type, item){
		switch (type) {
			case "message":
				item.comeFrom = 'sharePublication';
				this.sessionService.setDataShowShare(item);
				break;
			case "newTab":
				let url = this.environment.url + 'p/' + item.name;
				this.window.open(url, '_blank');
				break;
			case "copyLink":
				let urlExtension = this.environment.url + 'p/' + item.name;
				this.sessionService.setDataCopy(urlExtension);
				break;
			case "messageSong":
				item.comeFrom = 'shareSong';
				this.sessionService.setDataShowShare(item);
				break;
			case "newTabSong":
				let urlSong = this.environment.url + 's/' + item.name.slice(0, -4);
				this.window.open(urlSong, '_blank');
				break;
			case "copyLinkSong":
				let urlExtensionSong = this.environment.url + 's/' + item.name.slice(0, -4);
				this.sessionService.setDataCopy(urlExtensionSong);
				break;
		}
	}

	// Play item song
	playItem(data, item, key, type) {
		if (!this.sessionData.current.id) {
			this.alertService.success(this.translations.common.createAnAccountToListenSong);
		} else {
			if (this.audioPlayerData.key == key && this.audioPlayerData.type == type && this.audioPlayerData.postId == data.id) { // Play/Pause current
				item.playing = !item.playing;
				this.playerService.setPlayTrack(this.audioPlayerData);
			} else { // Play new one
				this.audioPlayerData.postId = data.id;
				this.audioPlayerData.list = data.audios;
				this.audioPlayerData.item = item;
				this.audioPlayerData.key = key;
				this.audioPlayerData.user = this.userData.id;
				this.audioPlayerData.username = this.userData.username;
				this.audioPlayerData.location = 'user';
				this.audioPlayerData.type = type;

				item.playing = true;
				this.playerService.setData(this.audioPlayerData);
			}
		}
	}

	// Item options: add/remove, share, search, report
	itemSongOptions(type, item, playlist){
		switch(type){
			case("addRemoveUser"):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				let dataU = {
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.id
				}

				this.audioDataService.addRemove(dataU)
					.subscribe((res: any) => {
						item.insertedId = res;
					});
			break;
			case("playlist"):
				item.removeType = !item.addRemoveUser ? "add" : "remove";

				let dataP = {
					type: item.removeType,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				}

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = ' ' + this.translations.common.hasBeenAddedTo + ' ' + playlist.title;
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
			break;
			case("createPlaylist"):
				let data = 'create';
				this.sessionService.setDataCreatePlaylist(data);
			break;
			case("report"):
				item.type = 'audio';
				this.sessionService.setDataReport(item);
			break;
			case("share"):
				item.comeFrom = 'share';
				this.sessionService.setDataShowShare(item);
			break;
		}
	}

	// Bookmarks
	markUnmark(item){
		if (this.sessionData.current.id) {
			item.bookmark.checked = !item.bookmark.checked;

			if (item.bookmark.checked)
				this.alertService.success(this.translations.bookmarks.addedTo);

			// data
			let data = {
				item: item.id,
				id: item.bookmark.id,
				type: item.bookmark.checked ? 'add' : 'remove'
			}

			this.bookmarksDataService.markUnmark(data)
				.subscribe(res => {
					if (res)
						item.bookmark.id = res;
				}, error => {
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Like / Unlike
	likeUnlike(item){
		if (this.sessionData.current.id) {
			if (item.liked) {
				item.liked = false;
				item.countLikes--;

				for (let i in item.likers)
					if (item.likers[i].id == this.sessionData.current.id)
						item.likers.splice(i, 1);
			} else {
				item.liked = true;
				item.countLikes++;

				item.likers.unshift(this.sessionData.current);
			}

			// data
			let data = {
				id: item.id,
				receiver: item.user.id,
				type: item.liked ? 'like' : 'unlike'
			}

			this.publicationsDataService.likeUnlike(data).subscribe();
		}
	}

	// Show people who like
	showLikes(item){
		item.comeFrom = 'publication';
		this.sessionService.setDataShowLikes(item);
	}

	// Show/hide comments box
	showComments(type, item){
		switch (type) {
			case "showHide":
				item.showCommentsBox = !item.showCommentsBox;
				
				if (item.disabledComments && !item.loaded)
					this.defaultComments('default', item);
				break;
			case "load":
				this.defaultComments('default', item);
				break;
		}
	}

	// Comments
	defaultComments(type, item) {
		if (type == 'default') {
			item.noData = false;
			item.loadMoreData = false;
			item.loadingData = true;
			item.comments = [];
			item.comments.list = [];
			item.rowsComments = 0;
			item.loaded = true;

			// New comments set
			this.newComment('clear', null, item);

			// Data
			let data = {
				id: item.id,
				rows: item.rowsComments,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.comments(data)
				.subscribe(res => {
					item.loadingData = false;

					if (!res || res.length == 0) {
						item.noData = true;
					} else {
						item.noData = false;
						item.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						item.comments.list = res;
					}
				}, error => {
					item.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type == 'more' && !item.loadingMoreData) {
			item.loadingMoreData = true;
			item.rowsComments++;

			let data = {
				id: item.id,
				rows: item.rowsComments,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.comments(data)
				.subscribe(res => {
					setTimeout(() => {
						item.loadingMoreData = false;
						item.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								item.comments.list.push(res[i]);
					}, 600);
				}, error => {
					item.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// New comment
	newComment(type, event, item){
		if (type == 'clear') {
			item.newCommentData = [];

			setTimeout(() => {
				item.newCommentData = {
					original: '',
					transformed: '',
					onBackground: '',
					eventTarget: '',
					lastTypedWord: []
				};

				this.newComment('checkPlaceholder', null, item);
			}, 100);
		} else if (type == 'writingChanges') {
			let str = event;
			item.newCommentData.original = event;
			
			// new line
			str = str.replace(/\n/g, '<br>');

			// hashtag
			str = str.replace(/(#)\w+/g, function(value){
				return '<span class="hashtag">' + value + '</span>';
			});

			// mention
			str = str.replace(/(@)\w+/g, function(value){
				return '<span class="mention">' + value + '</span>';
			});

			// url
			str = str.replace(this.urlRegex, function(value){
				return '<span class="url">' + value + '</span>';
			});

			// writing content
			item.newCommentData.transformed = str;

			//check empty contenteditable
			this.newComment('checkPlaceholder', null, item);
		} else if (type == 'keyCode') {
			if (event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 27) {
				// Space, Enter, Escape
				this.searchBoxMentions = false;
			} else {
				if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
					this.searchBoxMentions = false;
				} else {
					item.newCommentData.eventTarget = event.target;
					let position = this.getCaretPosition(event.target);
					let word = this.getCurrentWord(event.target, position);
					
					item.newCommentData.lastTypedWord = {
						word: word,
						position: position
					};
				}
			}
		} else if (type == 'checkPlaceholder') {
			if (item.newCommentData.original.length == 0)
				item.newCommentData.transformed = '<div class="placeholder">' + this.translations.common.commentPlaceholder + '</div>';
		} else if (type == 'transformBeforeSend') {
			let newData = {
				content: item.newCommentData.original ? item.newCommentData.original : '',
				original: item.newCommentData.original ? item.newCommentData.original : '',
				mentions: [],
				hashtags: []
			}

			// new line
			newData.content = newData.content.replace(/\n/g, '<br>');

			// hashtag
			newData.content = newData.content.replace(/(#)\w+/g, function(value){
				return '<a class="hashtag">' + value + '</a>';
			});

			// mention
			newData.content = newData.content.replace(/(@)\w+/g, function(value){
				newData.mentions.push(value);
				return '<a class="mention">' + value + '</a>';
			});

			// detect url
			newData.content = newData.content.replace(this.urlRegex, function(value){
				return '<a class="url">' + value + '</a>';
			});

			return newData;
		} else if (type == 'create') {
			if (item.newCommentData.original.trim().length == 0) {
				this.alertService.warning(this.translations.common.isTooShort);
			} else {
				let formatedData = this.newComment('transformBeforeSend', null, item);
				let dataCreate = {
					type: 'create',
					id: item.id,
					receiver: item.user.id,
					comment: formatedData.content,
					comment_original: formatedData.original,
					mentions: formatedData.mentions
				}

				this.publicationsDataService.comment(dataCreate)
					.subscribe((res: any) => {
						item.comments.list.unshift(res);
						item.countComments++;
						item.noData = false;

						this.newComment('clear', null, item);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
			}
		}
	}

	// Comments Options
	commentsOptions(type, item, comment){
		switch (type) {
			case "addRemove":
				comment.addRemove = !comment.addRemove;
				comment.type = !comment.addRemove ? "add" : "remove";

				let data = {
					receiver: item.user.id,
					type: comment.type,
					comment: comment.id,
					id: item.id
				}

				this.publicationsDataService.comment(data)
					.subscribe((res: any) => {
						if (comment.addRemove)
							item.countComments--;
						else
							item.countComments++;
					});
				break;
			case "report":
				item.type = 'publicationComment';
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Caret position on contenteditable
	getCaretPosition(element) {
		let w3 = (typeof this.window.getSelection != "undefined") && true,
			caretOffset = 0;

		if (w3) {
			let range = this.window.getSelection().getRangeAt(0);
			let preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		} else {
			this.alertService.error(this.translations.common.tryToUseAnotherBrowser);
		}

		return caretOffset;
	}

	// Get current typing word on contenteditable
	getCurrentWord(el, position) {
		let word = '';

		// Get content of div
		let content = el.textContent;

		// Check if clicked at the end of word
		position = content[position] === ' ' ? position - 1 : position;

		// Get the start and end index
		let startPosition = content.lastIndexOf(' ', position);
		startPosition = startPosition === content.length ? 0 : startPosition;
		let endPosition = content.indexOf(' ', position);
		endPosition = endPosition === -1 ? content.length : endPosition;

		return content.substring(startPosition + 1, endPosition);
	}
}
