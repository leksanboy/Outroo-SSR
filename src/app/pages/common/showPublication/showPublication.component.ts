import { Component, OnInit, OnDestroy, ViewChild, Inject, ElementRef, Renderer } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { BookmarksDataService } from '../../../../app/core/services/user/bookmarksData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var global: any;

@Component({
	selector: 'app-showPublication',
	templateUrl: './showPublication.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class ShowPublicationComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public userData: any = [];
	public audioPlayerData: any = [];
	public translations: any = [];
	public swiperConfig: any = {
		pagination: '.swiper-pagination',
		nextButton: '.swiperNext',
		prevButton: '.swiperPrev',
		paginationClickable: true,
		spaceBetween: 0
	};
	public notExists: boolean;
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;
	public isMobileScreen: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ShowPublicationComponent>,
    	private _fb: FormBuilder,
		private location: Location,
    	private renderer: Renderer,
    	private elementRef: ElementRef,
    	private alertService: AlertService,
    	private playerService: PlayerService,
    	private sessionService: SessionService,
    	private audioDataService: AudioDataService,
    	private bookmarksDataService: BookmarksDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService,
		private deviceService: DeviceDetectorService
	) {
		this.translations = data.translations;
		this.sessionData = data.sessionData;
		this.userData = data.userData;
		this.data.current = data.item ? data.item : [];
		this.isMobileScreen = this.deviceService.isMobile();

		// Click on a href
		this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
			if (event.target.localName == 'a')
				this.sessionService.setDataClickElementRef(event);
		});

		if (this.data.item) {
			// Check if exists
    		this.notExists = false;

	    	// Update replays
	    	this.updateReplays(this.data.current.id, this.sessionData.current.id);

	    	// Load comments
	    	this.defaultComments('default', this.data.current);
    	} else {
    		// Check if exists
    		this.notExists = true;
    	}
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.dialogRef.close(this.data.current);
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

    // Replays +1
	updateReplays(id, user) {
		let data = {
			id: id,
			user: user
		}

		this.publicationsDataService.updateReplays(data).subscribe();
	}

	// Bookmarks
	markUnmark(item){
		if (this.sessionData.current.id) {
			item.bookmark.checked = !item.bookmark.checked;

			// Se usa en la pantalla de bookmarks para saber los que ya estaban dentro
			item.marked = item.bookmark.checked ? false : true;

			if (item.bookmark.checked)
				this.alertService.success(this.translations.addedToSaved);

			// data
			let data = {
				item: item.id,
				id: item.bookmark.id,
				user: this.sessionData.current.id,
				type: item.bookmark.checked ? 'add' : 'remove'
			}

			this.bookmarksDataService.markUnmark(data)
				.subscribe(res => {
					if (res)
						item.bookmark.id = res;
				}, error => {
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		}
	}

	// Like / Unlike
	likeUnlike(item){
		if (item.liked) {
			item.liked = false;
			item.countLikes--;

			for (let i in item.likers) {
				if (item.likers[i].id == this.sessionData.current.id)
					item.likers.splice(i, 1);
			}
		} else {
			item.liked = true;
			item.countLikes++;

			item.likers.unshift(this.sessionData.current);
		}

		// data
		let data = {
			id: item.id,
			sender: this.sessionData.current.id,
			receiver: this.userData.id,
			type: item.liked ? 'like' : 'unlike'
		}

		this.publicationsDataService.likeUnlike(data).subscribe();
	}

	// Show people who like
	showLikes(item){
		item.comeFrom = 'publication';
		this.sessionService.setDataShowLikes(item);
	}

	// Item Options
	itemOptions(type, item){
		switch (type) {
			case "remove":
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				let dataAddRemove = {
					id: item.id,
					type: item.removeType,
					user: this.sessionData.current.id
				}

				this.publicationsDataService.addRemove(dataAddRemove).subscribe();
				break;
			case "disableComments":
				item.disabledComments = !item.disabledComments;

				let dataDisableComments = {
					id: item.id,
					type: item.disabledComments,
					user: this.sessionData.current.id
				}

				this.publicationsDataService.enableDisableComments(dataDisableComments).subscribe();
				break;
			case "report":
				item.type = 'photo';
				item.translations = this.translations;
				this.sessionService.setDataReport(item);
				break;
			case "close":
				this.dialogRef.close();
				break;
		}
	}

	// Play item song
	playItem(data, item, key, type) {
		if (this.audioPlayerData.key == key && this.audioPlayerData.type == type && this.audioPlayerData.postId == data.id) { // Play/Pause current
			item.playing = !item.playing;
			this.playerService.setPlayTrack(this.audioPlayerData);
		} else { // Play new one
			this.audioPlayerData.postId = data.id;
			this.audioPlayerData.list = data.audios;
			this.audioPlayerData.item = item;
			this.audioPlayerData.key = key;
			this.audioPlayerData.user = this.data.current.id;
			this.audioPlayerData.username = this.data.current.username;
			this.audioPlayerData.location = 'user';
			this.audioPlayerData.type = type;

			item.playing = true;
			this.playerService.setData(this.audioPlayerData);
		}
	}

	// Item audios options
	itemAudiosOptions(type, item, playlist){
		switch(type){
			case("addRemoveUser"):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'remove' : 'add';

				let dataOther = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					song: item.id
				}

				this.audioDataService.addRemove(dataOther)
					.subscribe((res: any) => {
						item.insertedId = res.json();
					});
				break;
			case("playlist"):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'remove' : 'add';

				let dataP = {
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				}

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = ' ' + this.translations.hasBeenAddedTo + playlist.title;
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
				break;
			case("createPlaylist"):
				let data = 'create';
				this.sessionService.setDataCreatePlaylist(data);
				break;
			case("report"):
				item.type = 'audio';
				item.translations = this.translations;
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Show/hide comments box
	showComments(type, item){
		switch (type) {
			case "showHide":
				item.showCommentsBox = !item.showCommentsBox;
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
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more') {
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

						if (!res || res.length == 0)
							for (let i in res)
								item.comments.list.push(res[i]);
					}, 600);
				}, error => {
					item.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
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
				item.newCommentData.transformed = '<div class="placeholder">' + this.translations.whatsHappening.one + '</div>';
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
				this.alertService.success(this.translations.commentIsTooShort);
			} else {
				let formatedData = this.newComment('transformBeforeSend', null, item);
				let dataCreate = {
					type: 'create',
					id: item.id,
					sender: this.sessionData.current.id,
					receiver: this.userData.id,
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
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			}
		}
	}

	// Comments Options
	commentsOptions(type, item, comment){
		switch (type) {
			case "addRemove":
				comment.addRemove = !comment.addRemove;
				comment.removeType = comment.addRemove ? 'remove' : 'add';

				let data = {
					sender: this.sessionData.current.id,
					receiver: this.userData.id,
					type: comment.removeType,
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
				item.type = 'photoComment';
				item.translations = this.translations;
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
			this.alertService.error(this.translations.tryToUseAnotherBrowser);
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

	// Close
	close(){
		this.dialogRef.close(this.data.current);
	}
}
