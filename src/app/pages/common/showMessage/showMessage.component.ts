import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Inject, AfterViewChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipsModule } from '@angular/material';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { MessageDataService } from '../../../../app/core/services/user/messageData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

import { DateTimePipe } from '../../../../app/core/pipes/datetime.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';
import { TruncatePipe } from '../../../../app/core/pipes/truncate.pipe';

declare var global: any;

@Component({
	selector: 'app-show-message',
	templateUrl: './showMessage.component.html',
	animations: [
		trigger(
			'showFromBottomAnimation',
			[
				transition(':enter', [
					style({transform: 'translateY(100%)', 'opacity': 0}),
					animate('200ms', style({'transform': 'translateY(0)', '-webkit-transform': 'translateY(0)', 'opacity': 1}))
				]),
				transition(':leave', [
					style({transform: 'translateY(0)', 'opacity': 1}),
					animate('200ms', style({'transform': 'translateY(100%)', '-webkit-transform': 'translateY(100%)', 'opacity': 0}))
				])
			]
		)
	],
	providers: [ DateTimePipe, SafeHtmlPipe, TruncatePipe ]
})
export class ShowMessageComponent implements OnInit, OnDestroy {
	@ViewChild('conversationContainer') private myScrollContainer: ElementRef;
	public env: any = environment;
	public window: any = global;
	public translations: any = [];
	public sessionData: any = [];
	public userData: any = [];
	public dataDefault: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public searchBoxMentions: boolean;
	public urlRegex = this.env.urlRegex;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ShowMessageComponent>,
		private router: Router,
		public dialog: MatDialog,
		private location: Location,
		private alertService: AlertService,
		private sessionService: SessionService,
		private messageDataService: MessageDataService
	) {
		this.sessionData = this.data.sessionData;
		this.userData = this.data.userData;
		this.translations = this.data.translations;

		// New comments set
		this.newComment('clear', null, this.data);

		// Get default
		this.default('default');
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.close();
	}

	// ngAfterViewChecked() {
	// 	this.scrollToBottom();
	// }

	scrollToBottom() {
		this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
	}

	default(type) {
		if (type === 'default') {
			this.dataDefault = {
				list: [],
				rows: 0,
				noData: false,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			};

			const d = {
				user: this.userData.id,
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.messageDataService.default(d)
				.subscribe((res: any) => {
					this.dataDefault.loadingData = false;

					if (!res) {
						this.dataDefault.noData = true;
						this.dataDefault.noMore = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataDefault.noData = false;
						this.dataDefault = res;

						if (!res || res.length < this.env.cuantity) {
							this.dataDefault.noMore = true;
						}

						// Scroll to bottom
						this.scrollToBottom();
					}
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		} else if (type === 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			const data = {
				user: this.userData.id,
				rows: this.dataDefault.rows,
				cuantity: this.env.cuantity
			};

			this.messageDataService.default(data)
				.subscribe((res: any) => {
					setTimeout(() => {
						this.dataDefault.loadMoreData = (!res || res.length < this.env.cuantity) ? false : true;
						this.dataDefault.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (const i of res) {
								if (i) {
									this.dataDefault.list.push(i);
								}
							}
						}

						if (!res || res.length < this.env.cuantity) {
							this.dataDefault.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	itemOptions(type, item) {
		switch (type) {
			case 'remove':
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				const dataAddRemove = {
					id: item.id,
					type: item.removeType
				};

				this.messageDataService.addRemove(dataAddRemove).subscribe();
				break;
			case 'report':
				item.type = 'notification';
				item.translations = this.translations;
				this.sessionService.setDataReport(item);
				break;
		}
	}

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

				this.newComment('checkPlaceholder', null, item);
			}, 100);
		} else if (type === 'writingChanges') {
			let str = event;
			item.newCommentData.original = event;

			// new line
			str = str.replace(/\n/g, '<br>');

			// hashtag
			str = str.replace(/(#)\w+/g, function(value) {
				return '<span class="hashtag">' + value + '</span>';
			});

			// mention
			str = str.replace(/(@)\w+/g, function(value) {
				return '<span class="mention">' + value + '</span>';
			});

			// url
			str = str.replace(this.urlRegex, function(value) {
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
			const newData = {
				content: item.newCommentData.original ? item.newCommentData.original : '',
				original: item.newCommentData.original ? item.newCommentData.original : '',
				mentions: [],
				hashtags: []
			};

			// new line
			newData.content = newData.content.replace(/\n/g, '<br>');

			// hashtag
			newData.content = newData.content.replace(/(#)\w+/g, function(value) {
				return '<a class="hashtag">' + value + '</a>';
			});

			// mention
			newData.content = newData.content.replace(/(@)\w+/g, function(value) {
				newData.mentions.push(value);
				return '<a class="mention">' + value + '</a>';
			});

			// detect url
			newData.content = newData.content.replace(this.urlRegex, function(value) {
				return '<a class="url">' + value + '</a>';
			});

			return newData;
		} else if (type === 'create') {
			if (item.newCommentData.original.trim().length === 0) {
				this.alertService.success(this.translations.common.isTooShort);
			} else {
				const formatedData = this.newComment('transformBeforeSend', null, item);
				const dataCreate = {
					id: this.dataDefault.id,
					user: this.userData.id,
					content: formatedData.content,
					content_original: formatedData.original
				};

				this.messageDataService.comment(dataCreate)
					.subscribe((res: any) => {
						this.dataDefault.noData = false;
						this.dataDefault.id = res.content;
						this.dataDefault.list.push(res);

						// Clear comment box
						this.newComment('clear', null, item);

						// Scroll to bottom
						this.scrollToBottom();
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
			}
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

	close() {
		this.data.close = true;

		this.dialogRef.close(this.data);
	}
}
