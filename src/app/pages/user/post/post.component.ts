import { Component, OnInit, OnDestroy, Inject, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var global: any;

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	providers: [TimeagoPipe, SafeHtmlPipe]
})
export class PostComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public dataDefault: any = [];
	public data: any = [];
	public swiperConfig: any = {
		pagination: '.swiper-pagination',
		nextButton: '.swiperNext',
		prevButton: '.swiperPrev',
		paginationClickable: true,
		spaceBetween: 0
	};
	public activeLanguage: any;
	public activeSessionPlaylists: any;
	public activePlayerInformation: any;
	public hideAd: boolean;
	public searchBoxMentions: boolean;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private renderer: Renderer2,
		private elementRef: ElementRef,
		private alertService: AlertService,
		private playerService: PlayerService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private publicationsDataService: PublicationsDataService,
		private metaService: MetaService,
		private routingStateService: RoutingStateService,
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Load default
		const n: any = this.activatedRoute.snapshot.params.name;
		this.default(n);

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
				this.getTranslations(data);
			});

		// Click on a href
		this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
			if (event.target.localName === 'a') {
				this.sessionService.setDataClickElementRef(event);
			}
		});
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeSessionPlaylists.unsubscribe();
		this.activePlayerInformation.unsubscribe();
		this.activeLanguage.unsubscribe();
	}

	// Go back
	goBack() {
		this.routingStateService.getPreviousUrl();
	}

	// Replays +1
	updateReplays(id) {
		const data = {
			id: id
		};

		this.publicationsDataService.updateReplays(data).subscribe();
	}

	// Push Google Ad
	pushAd() {
		const ad = {
			contentTypeAd: true,
			content: this.env.ad
		};

		setTimeout(() => {
			const g = (this.window['adsbygoogle'] = this.window['adsbygoogle'] || []).push({});
			if (g === 1) {
				this.hideAd = true;
			}
		}, 100);

		return ad;
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Default
	default(name) {
		this.dataDefault.loadingData = true;

		const data = {
			name: name
		};

		this.publicationsDataService.getPost(data)
			.subscribe((res: any) => {
				this.dataDefault.loadingData = false;

				if (!res || res.length === 0) {
					this.dataDefault.noData = true;
				} else {
					this.dataDefault.list = [];
					this.dataDefault.list.push(res);
					this.showComments('showHide', res);

					// Update replays
					this.updateReplays(res.id);

					// Meta
					const t = res.user.name + ' - ' + (res.content_original ? res.content_original : (res.audios ? res.audios[0].original_title : ''));
					const metaData = {
						page: t,
						title: t,
						description: t,
						keywords: t,
						url: this.env.url + 'p/' + res.name,
						image: this.env.url + (res.photos ? ('assets/media/photos/thumbnails/' + res.photos[0].name) : (res.audios ? 'assets/media/audios/thumbnails/' + res.audios[0].image : this.env.defaultPostImage))
					};
					this.metaService.setData(metaData);

					// Set Google analytics
					const url = 'p/' + name;
					const title = t;
					const userId = this.sessionData ? (this.sessionData.current ? this.sessionData.current.id : null) : null;
					this.userDataService.analytics(url, title, userId);
				}
			}, error => {
				this.dataDefault.loadingData = false;
				this.dataDefault.noData = true;
				this.alertService.error(this.translations.common.anErrorHasOcurred);
			});
	}

	// Play video
	playVideo(type, item) {
		if (type === 'play') {
			let player: any = document.getElementById('videoPlayer' + item.id);
			item.playButton = !item.playButton;

			if (player.paused) {
				player.play();
			} else {
				player.pause();
			}
		} else if (type === 'end') {
			item.playButton = false;
		}
	}

	// Item options
	itemPublicationOptions(type, item) {
		switch (type) {
			case 'remove':
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				const dataAddRemove = {
					id: item.id,
					type: item.removeType
				};

				this.publicationsDataService.addRemove(dataAddRemove).subscribe();
				break;
			case 'disableComments':
				item.disabledComments = !item.disabledComments;

				const dataDisableComments = {
					id: item.id,
					type: item.disabledComments
				};

				this.publicationsDataService.enableDisableComments(dataDisableComments).subscribe();
				break;
			case 'report':
				item.type = 'publication';
				this.sessionService.setDataReport(item);
				break;
			case 'message':
				item.comeFrom = 'sharePublication';
				this.sessionService.setDataNewShare(item);
				break;
			case 'newTab':
				const url = this.env.url + 'p/' + item.name;
				this.window.open(url, '_blank');
				break;
			case 'copyLink':
				const urlExtension = this.env.url + 'p/' + item.name;
				this.sessionService.setDataCopy(urlExtension);
				break;
		}
	}

	// Play item song
	playSong(data, item, key, type) {
		if (this.audioPlayerData.key === key &&
			this.audioPlayerData.type === type &&
			this.audioPlayerData.postId === data.id
		) { // Play/Pause current
			item.playing = !item.playing;
			this.playerService.setPlayTrack(this.audioPlayerData);
		} else { // Play new one
			this.audioPlayerData.postId = data.id;
			this.audioPlayerData.list = data.audios;
			this.audioPlayerData.item = item;
			this.audioPlayerData.key = key;
			this.audioPlayerData.location = 'post';
			this.audioPlayerData.type = type;

			item.playing = true;
			this.playerService.setData(this.audioPlayerData);
		}
	}

	// Item options: add/remove, share, search, report
	itemSongOptions(type, item, playlist) {
		switch (type) {
			case ('addRemoveUser'):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				const dataU = {
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.id
				};

				this.audioDataService.addRemove(dataU)
					.subscribe((res: any) => {
						item.insertedId = res;
					});
				break;
			case ('playlist'):
				item.removeType = !item.addRemoveUser ? 'add' : 'remove';

				const dataP = {
					type: item.removeType,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				};

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						const song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = ' ' + this.translations.common.hasBeenAddedTo + ' ' + playlist.title;
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case ('createPlaylist'):
				const dataCP = {
					type: 'create',
					item: item
				};

				this.sessionService.setDataCreatePlaylist(dataCP);
				break;
			case ('share'):
				alert('Working on Share with friends');
				break;
			case ('report'):
				item.type = 'audio';
				this.sessionService.setDataReport(item);
				break;
			case 'message':
				item.comeFrom = 'shareSong';
				this.sessionService.setDataNewShare(item);
				break;
			case 'newTab':
				const urlSong = this.env.url + 's/' + item.name.slice(0, -4);
				this.window.open(urlSong, '_blank');
				break;
			case 'copyLink':
				const urlExtensionSong = this.env.url + 's/' + item.name.slice(0, -4);
				this.sessionService.setDataCopy(urlExtensionSong);
				break;
		}
	}

	// Bookmarks
	markUnmark(item) {
		if (this.sessionData) {
			item.bookmark.checked = !item.bookmark.checked;

			if (item.bookmark.checked) {
				this.alertService.success(this.translations.bookmarks.addedTo);
			}

			const data = {
				item: item.id,
				id: item.bookmark.id,
				type: item.bookmark.checked ? 'add' : 'remove'
			};

			this.publicationsDataService.markUnmark(data)
				.subscribe(res => {
					if (res) {
						item.bookmark.id = res;
					}
				}, error => {
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Like / Unlike
	likeUnlike(item) {
		if (this.sessionData) {
			if (item.liked) {
				item.liked = false;
				item.countLikes--;

				for (const i in item.likers) {
					if (item.likers[i].id === this.sessionData.current.id) {
						item.likers.splice(i, 1);
					}
				}
			} else {
				item.liked = true;
				item.countLikes++;

				item.likers.unshift(this.sessionData.current);
			}

			const data = {
				id: item.id,
				receiver: item.user.id,
				type: item.liked ? 'like' : 'unlike'
			};

			this.publicationsDataService.likeUnlike(data).subscribe();
		}
	}

	// Show people who like
	showLikes(item) {
		item.comeFrom = 'publication';
		this.sessionService.setDataShowLikes(item);
	}

	// Show/hide comments box
	showComments(type, item) {
		switch (type) {
			case 'showHide':
				item.showCommentsBox = !item.showCommentsBox;

				if (!item.disabledComments) {
					if (!item.loaded) {
						this.defaultComments('default', item);
					}
				}
				break;
			case 'load':
				this.defaultComments('default', item);
				break;
		}
	}

	// Comments
	defaultComments(type, item) {
		if (type === 'default') {
			item.noData = false;
			item.loadMoreData = false;
			item.loadingData = true;
			item.comments = [];
			item.comments.list = [];
			item.comments.reply = null;
			item.rowsComments = 0;
			item.loaded = true;

			// New comments set
			this.newComment('clear', null, item);

			// Data
			const data = {
				id: item.id,
				rows: item.rowsComments,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.comments(data)
				.subscribe((res: any) => {
					item.loadingData = false;

					if (!res || res.length === 0) {
						item.noData = true;
					} else {
						item.noData = false;
						item.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						item.comments.list = res;
					}
				}, error => {
					item.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !item.loadingMoreData) {
			item.loadingMoreData = true;
			item.rowsComments++;

			const data = {
				id: item.id,
				rows: item.rowsComments,
				cuantity: this.env.cuantity
			};

			this.publicationsDataService.comments(data)
				.subscribe((res: any) => {
					item.loadingMoreData = false;
					item.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;

					// Push items
					if (!res || res.length > 0) {
						for (const i in res) {
							if (i) {
								item.comments.list.push(res[i]);
							}
						}
					}
				}, error => {
					item.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// New comment
	newComment(type, event, item) {
		if (type === 'clear') {
			item.newCommentData = [];

			setTimeout(() => {
				item.newCommentData = {
					original: '',
					transformed: '',
					onBackground: '',
					eventTarget: '',
					lastTypedWord: []
				};

				// Put as default
				this.newComment('checkPlaceholder', null, item);

				// Cancel reply
				this.replyComment('cancel', null, null, item);
			}, 100);
		} else if (type === 'writingChanges') {
			let str = event;
			item.newCommentData.original = event;

			// new line
			str = str.replace(/\n/g, '<br>');

			// hashtag
			str = str.replace(/(#)\w+/g, function (value) {
				return '<span class="hashtag">' + value + '</span>';
			});

			// mention
			str = str.replace(/(@)\w+/g, function (value) {
				return '<span class="mention">' + value + '</span>';
			});

			// url
			str = str.replace(this.env.urlRegex, function (value) {
				return '<span class="url">' + value + '</span>';
			});

			// writing content
			item.newCommentData.transformed = str;

			// check empty contenteditable
			this.newComment('checkPlaceholder', null, item);
		} else if (type === 'keyCode') {
			if (event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 27) {
				// Space, Enter, Escape
				this.searchBoxMentions = false;
			} else {
				if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
					this.searchBoxMentions = false;
				} else {
					item.newCommentData.eventTarget = event.target;
					const position = this.getCaretPosition(event.target);
					const word = this.getCurrentWord(event.target, position);

					item.newCommentData.lastTypedWord = {
						word: word,
						position: position
					};
				}
			}
		} else if (type === 'checkPlaceholder') {
			if (item.newCommentData.original.length === 0) {
				item.newCommentData.transformed = '<div class="placeholder">' + this.translations.common.commentPlaceholder + '</div>';
			}
		} else if (type === 'transformBeforeSend') {
			// Add replied user
			if (item.comments.reply) {
				item.newCommentData.original = '@' + item.comments.reply.child.user.username + ' ' + item.newCommentData.original;
			}

			const newData = {
				content: item.newCommentData.original,
				original: item.newCommentData.original,
				mentions: [],
				hashtags: []
			};

			// new line
			newData.content = newData.content.replace(/\n/g, '<br>');

			// hashtag
			newData.content = newData.content.replace(/(#)\w+/g, function (value) {
				return '<a class="hashtag">' + value + '</a>';
			});

			// mention
			newData.content = newData.content.replace(/(@)\w+/g, function (value) {
				newData.mentions.push(value);
				return '<a class="mention">' + value + '</a>';
			});

			// detect url
			newData.content = newData.content.replace(this.env.urlRegex, function (value) {
				return '<a class="url">' + value + '</a>';
			});

			return newData;
		} else if (type === 'create') {
			if (item.newCommentData.original.trim().length === 0) {
				this.alertService.warning(this.translations.common.isTooShort);
			} else {
				const formatedData = this.newComment('transformBeforeSend', null, item);
				const dataCreate = {
					type: 'create',
					id: item.id,
					receiver: item.user.id,
					comment: formatedData.content,
					comment_original: formatedData.original,
					comment_reply_parent_id: (item.comments.reply ? item.comments.reply.parent.id : null),
					comment_reply_child_id: (item.comments.reply ? item.comments.reply.child.id : null),
					mentions: formatedData.mentions
				};

				this.publicationsDataService.comment(dataCreate)
					.subscribe((res: any) => {
						item.countComments++;
						item.noData = false;

						if (dataCreate.comment_reply_parent_id) {
							let comm = item.comments.list.filter(i => i.id == dataCreate.comment_reply_parent_id)[0];

							if (comm.list) {
								comm.list.push(res);
							} else {
								comm.list = [];
								comm.list.push(res);
							}
						} else {
							item.comments.list.push(res);
							this.window.scrollTo(0, 1000);
						}

						this.newComment('clear', null, item);

						// Check if commentsBox is open
						if (!item.showCommentsBox) {
							this.showComments('showHide', item);
						}
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
			}
		}
	}

	// Reply
	replyComment(type, parent, child, item) {
		if (type === 'create') {
			item.comments.reply = {
				parent: parent,
				child: child
			};
		} else if (type === 'cancel') {
			item.comments.reply = null;
		}
	}

	// Comments Options
	commentsOptions(type, item, comment) {
		switch (type) {
			case 'addRemove':
				comment.addRemove = !comment.addRemove;
				comment.type = !comment.addRemove ? 'add' : 'remove';

				const data = {
					receiver: item.user.id,
					type: comment.type,
					comment: comment.id,
					id: item.id
				};

				this.publicationsDataService.comment(data)
					.subscribe((res: any) => {
						if (comment.addRemove) {
							item.countComments--;
						} else {
							item.countComments++;
						}
					});
				break;
			case 'report':
				item.type = 'publicationComment';
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Caret position on contenteditable
	getCaretPosition(element) {
		const w3 = (typeof this.window.getSelection !== 'undefined') && true;
		let caretOffset = 0;

		if (w3) {
			const range = this.window.getSelection().getRangeAt(0);
			const preCaretRange = range.cloneRange();
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
		// Get content of div
		const content = el.textContent;

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
