import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { PhotoDataService } from '../../../../app/core/services/user/photoData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var global: any;

@Component({
	selector: 'app-showPhoto',
	templateUrl: './showPhoto.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class ShowPhotoComponent implements OnInit {
	@ViewChild('videoPlayer') videoPlayer: any;
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public notExists: boolean;
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;
	public isMobileScreen: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private alertService: AlertService,
		public dialogRef: MatDialogRef<ShowPhotoComponent>,
		private location: Location,
		private sessionService: SessionService,
		private photoDataService: PhotoDataService,
		private notificationsDataService: NotificationsDataService,
		private deviceService: DeviceDetectorService
	) {
		this.translations = data.translations;
		this.sessionData = data.sessionData;
		this.userData = data.userData;
		this.data.current = data.item ? data.item : [];
		this.data.list = data.list ? data.list : [];
		this.isMobileScreen = this.deviceService.isMobile();

		if (this.data.item) {
			// Check if exists
			this.notExists = false;

			// Load video
			this.playVideo('load');

			// Set url
			if (this.data.comeFrom == 'photos')
				this.location.go('/' + this.userData.username + '/photos/' + this.data.current.name.split('.')[0]);

			// Check if photo is liked
			this.checkLike(this.data.current.id, this.sessionData.current.id);
			
			// Update replays
			this.updateReplays(this.data.current.id, this.sessionData.current.id);

			// Load comments
			this.defaultComments('default', this.data.current);
		} else {
			this.notExists = true;
		}
	}

	ngOnInit() {
		// not in use
	}

	// Prev/Next
	prevNext(type) {
		// Load video
		this.playVideo('load');

		// Prev / Next
		if (type == 'prev')
			this.data.index == 0 ? this.data.index = this.data.list.length - 1 : this.data.index = this.data.index - 1;
		else if (type == 'next')
			this.data.index == this.data.list.length - 1 ? this.data.index = 0 : this.data.index = this.data.index + 1;

		// Set new photo from list
		this.data.current = this.data.list[this.data.index];

		// Change url whitout reloading
		this.location.go('/' + this.userData.username + '/photos/' + this.data.current.name.split('.')[0]);

		// Check if photo is liked
		this.checkLike(this.data.current.id, this.sessionData.current.id);

		// Update replays
		this.updateReplays(this.data.current.id, this.sessionData.current.id);

		// Set comments
		this.defaultComments('default', this.data.current);
	}

	// Play video
	playVideo(type){
		if (type == 'load') {
			if (this.data.current.mimetype.indexOf('video') !== -1) {
				this.data.current.playButton = false;

				if (this.videoPlayer) {
					this.videoPlayer.nativeElement.removeAttribute("controls");
					this.videoPlayer.nativeElement.pause();
					this.videoPlayer.nativeElement.load();
				}
			}
		} else if (type == 'play') {
			this.videoPlayer.nativeElement.removeAttribute("controls");
			this.videoPlayer.nativeElement.play();
			this.data.current.playButton = true;
		}
	}

	// Replays +1
	updateReplays(id, user) {
		let data = {
			id: id,
			user: user
		}

		this.photoDataService.updateReplays(data).subscribe();
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

				this.photoDataService.addRemove(dataAddRemove).subscribe();
				break;
			case "disableComments":
				item.disabledComments = !item.disabledComments;

				let dataDisableComments = {
					id: item.id,
					type: item.disabledComments,
					user: this.sessionData.current.id
				}

				this.photoDataService.enableDisableComments(dataDisableComments).subscribe();
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

	// Check like
	checkLike(id, user){
		let data = {
			id: id,
			user: user
		}

		this.photoDataService.checkLike(data)
			.subscribe(res => {
				this.data.current.liked = res.liked;
				this.data.current.likers = res.likers;
			});
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
				sender: this.sessionData.current.id,
				receiver: this.userData.id,
				type: item.liked ? 'like' : 'unlike'
			}

			this.photoDataService.likeUnlike(data).subscribe();
		}
	}

	// Show people who like
	showLikes(item){
		item.comeFrom = 'photo';
		this.sessionService.setDataShowLikes(item);
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

			this.photoDataService.comments(data)
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
					this.alertService.success(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more') {
			item.loadingMoreData = true;
			item.rowsComments++;

			let data = {
				id: item.id,
				rows: item.rowsComments,
				cuantity: this.environment.cuantity
			}

			this.photoDataService.comments(data)
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
					this.alertService.success(this.translations.anErrorHasOcurred);
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

				this.photoDataService.comment(dataCreate)
					.subscribe((res: any) => {
						item.comments.list.unshift(res);
						item.countComments++;
						item.noData = false;

						this.newComment('clear', null, item);
					}, error => {
						this.alertService.success(this.translations.anErrorHasOcurred);
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

				this.photoDataService.comment(data)
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
		this.dialogRef.close();
	}
}
