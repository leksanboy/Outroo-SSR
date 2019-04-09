import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Inject, AfterViewChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipsModule } from '@angular/material';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

import { ChatDataService } from '../../../../app/core/services/user/chatData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

import { DateTimePipe } from '../../../../app/core/pipes/datetime.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';
import { TruncatePipe } from '../../../../app/core/pipes/truncate.pipe';

declare var global: any;

@Component({
	selector: 'app-showConversation',
	templateUrl: './showConversation.component.html',
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
export class ShowConversationComponent implements OnInit, OnDestroy, AfterViewChecked {
	@ViewChild('conversationContainer') private myScrollContainer: ElementRef;
	public environment: any = environment;
	public window: any = global;
	public translations: any = [];
	public sessionData: any = [];
	public actionFormSearch: FormGroup;
	public dataDefault: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public dataUsers: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public dataSearch: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public dataChats: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public showUsers: boolean;
	public saveLoading: boolean;
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ShowConversationComponent>,
		private router: Router,
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private location: Location,
		private alertService: AlertService,
		private sessionService: SessionService,
		private chatDataService: ChatDataService,
		private followsDataService: FollowsDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService
	) {
		this.translations = data.translations;
		this.sessionData = data.sessionData;
		this.data.current = data.item ? data.item : [];
		this.data.users = [];
		this.data.list = [];
		this.data.new = false;

		// New comments set
		this.newComment('clear', null, this.data.current);

		// Check if is new or conversation
		if (this.data.comeFrom == 'new'){
			this.data.active = 'default';

			// Get default following users list
			this.defaultUsers();

			// Search
			this.actionFormSearch = this._fb.group({
				caption: ['']
			});

			// Search/Reset
			this.actionFormSearch.controls["caption"].valueChanges
				.pipe(
					debounceTime(400),
					distinctUntilChanged())
				.subscribe(val => {
					(val.length > 0) ? this.search('default') : this.search('clear');
				});
		} else if (this.data.comeFrom == 'conversation'){
			this.data.users = data.item.users ? data.item.users : [];
			
			// Get default conversation
			this.defaultConversation('default', data.item.id);
		} else if (this.data.comeFrom == 'sharePublication'){
			this.data.active = 'default';

			// Search
			this.actionFormSearch = this._fb.group({
				caption: ['']
			});

			// Search/Reset
			this.actionFormSearch.controls["caption"].valueChanges
				.pipe(
					debounceTime(400),
					distinctUntilChanged())
				.subscribe(val => {
					(val.length > 0) ? this.search('default') : this.search('clear');
				});

			// Get default following users list
			this.defaultUsers();

			// Get default chats
			this.defaultChats();
		} else if (this.data.comeFrom == 'shareSong'){
			this.data.active = 'default';

			// Search
			this.actionFormSearch = this._fb.group({
				caption: ['']
			});

			// Search/Reset
			this.actionFormSearch.controls["caption"].valueChanges
				.pipe(
					debounceTime(400),
					distinctUntilChanged())
				.subscribe(val => {
					(val.length > 0) ? this.search('default') : this.search('clear');
				});

			// Get default following users list
			this.defaultUsers();

			// Get default chats
			// this.defaultChats();
		}
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.close();
	}

	ngAfterViewChecked() {
		// this.scrollToBottom();
	}

	// Auto scroll to bottom
	scrollToBottom(): void {
		try {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
		} catch(err) { }
	}

	// Default
	defaultConversation(type, id) {
		if (type == 'default') {
			this.dataDefault = {
				list: [],
				rows: 0,
				noData: false,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			}

			let data = {
				id: id,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity
			}

			this.chatDataService.conversation(data)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (!res || res.length == 0) {
						this.dataDefault.noData = true;
						this.dataDefault.noMore = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataDefault.noData = false;
						this.dataDefault.list = res;

						if (!res || res.length < this.environment.cuantity)
							this.dataDefault.noMore = true;

						// Scroll to bottom
						this.scrollToBottom();
					}
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				id: this.dataDefault.id,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity
			}

			this.chatDataService.conversation(data)
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
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		}
	}

	// Default users
	defaultUsers(){
		this.dataUsers = {
			list: [],
			rows: 0,
			noData: false,
			loadingData: true,
			loadMoreData: false,
			loadingMoreData: false
		}

		let data = {
			user: this.sessionData.current.username,
			session: this.sessionData.current.id,
			type: 'following',
			rows: this.dataUsers.rows,
			cuantity: environment.cuantity
		}

		this.followsDataService.default(data)
			.subscribe(res => {
				this.dataUsers.loadingData = false;

				if (res.length == 0) {
					this.dataUsers.noData = true;
				} else {
					res.length < environment.cuantity ? this.dataUsers.loadMoreData = false : this.dataUsers.loadMoreData = true;
					this.dataUsers.noData = false;
					this.dataUsers.list = res;
				}
			}, error => {
				this.dataUsers.loadingData = false;
				this.alertService.error(this.translations.anErrorHasOcurred);
			});
	}

	// Default chats
	defaultChats(){
		this.dataUsers = {
			list: [],
			rows: 0,
			noData: false,
			loadingData: true,
			loadMoreData: false,
			loadingMoreData: false
		}

		let data = {
			user: this.sessionData.current.id,
			rows: this.dataUsers.rows,
			cuantity: environment.cuantity
		}

		this.chatDataService.default(data)
			.subscribe(res => {
				this.dataChats.loadingData = false;

				if (!res || res.length == 0) {
					this.dataChats.noData = true;
					this.dataChats.noMore = true;
				} else {
					this.dataChats.loadMoreData = (res.length < environment.cuantity) ? false : true;
					this.dataChats.noData = false;
					this.dataChats.list = res;

					if (res.length < environment.cuantity)
						this.dataChats.noMore = true;
				}
			}, error => {
				this.dataChats.loadingData = false;
				this.alertService.error(this.translations.anErrorHasOcurred);
			});
	}

	// Search
	search(type){
		if (type == 'default') {
			this.data.active = 'search';
			this.dataSearch = {
				list: [],
				rows: 0,
				noData: false,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			}

			let data = {
				session: this.sessionData.current.id,
				user: this.sessionData.current.id,
				caption: this.actionFormSearch.get('caption').value,
				cuantity: environment.cuantity
			}

			this.followsDataService.searchFollowing(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadingData = false;

						if (!res || res.length == 0) {
							this.dataSearch.noData = true;
							this.dataSearch.noMore = true;
						} else {
							this.dataSearch.loadMoreData = (res.length < environment.cuantity) ? false : true;
							this.dataSearch.noData = false;
							
							// validate added
							for(let i in res)
								for(let u in this.data.users)
									if (res[i].id == this.data.users[u].user.id)
										res[i].added = true;

							this.dataSearch.list = res;

							if (res.length < environment.cuantity)
								this.dataSearch.noMore = true;
						}
					}, 600);
				});
		} else if (type == 'more' && !this.dataSearch.noMore) {
			this.dataSearch.loadingMoreData = true;
			this.dataSearch.rows++;

			let data = {
				session: this.sessionData.current.id,
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: environment.cuantity
			}

			this.followsDataService.searchFollowing(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataSearch.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								this.dataSearch.list.push(res[i]);

						if (res.length < environment.cuantity)
							this.dataSearch.noMore = true;
					}, 600);
				});
		} else if (type == 'clear') {
			this.data.active = 'default';
			this.actionFormSearch.get('caption').setValue('');
		}
	}

	// Add to new chat
	addUserToNewChat(type, item){
		item.type = type;
		item.added = !item.added;

		if (!item.added) {
			// Remove from users list and chat list
			if (type == 'user') {
				for (let i in this.dataUsers.list)
					if (this.dataUsers.list[i].id == item.id)
						this.dataUsers.list[i].added = false;
			} else if (type == 'chat') {
				for (let i in this.dataChats.list)
					if (this.dataChats.list[i].id == item.id)
						this.dataChats.list[i].added = false;
			}

			// Remove from common list
			for (let i in this.data.users) {
				if (this.data.users[i].id == item.id && this.data.users[i].type == item.type){
					this.data.users.splice(i, 1);
					return false;
				}
			}
		} else {
			this.data.users.push(item);
		}
	}

	// Init new chat/conversation
	initNewChat(){
		this.saveLoading = true;
		let list = [];

		for (let i in this.data.users)
			list.push(this.data.users[i].id);

		list.push(this.sessionData.current.id);

		let data = {
			sender: this.sessionData.current.id,
			receivers: list
		}

		this.chatDataService.newChat(data)
			.subscribe((res: any) => {
				this.saveLoading = false;
				this.data.comeFrom = 'conversation';
				this.data.current.id = res;
				this.data.new = true;
				this.data.users.all = this.data.users;
				this.data.users.excluded = this.data.users;
				this.dataDefault = {
					list: [],
					rows: 0,
					noData: true,
					loadingData: false,
					loadMoreData: false,
					loadingMoreData: false,
					noMore: false
				};
			}, error => {
				this.saveLoading = false;
				this.alertService.error(this.translations.anErrorHasOcurred);
			});
	}

	// Send shared
	sendShared(){
		for (let i in this.data.users) {
			if (this.data.users[i].type == 'user') {
				let list = [];
				list.push(this.data.users[i].user.id);
				list.push(this.sessionData.current.id);

				let data = {
					sender: this.sessionData.current.id,
					receivers: list,
					publication:  this.data.item.id
				}

				// Create respective chats and insert publication
				this.chatDataService.newChat(data)
					.subscribe((res: any) => {
						this.saveLoading = false;
						this.data.comeFrom = 'conversation';
						this.data.current.id = res;
						this.data.new = true;
					}, error => {
						this.saveLoading = false;
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			} else if (this.data.users[i].type == 'chat') {
				let dataCreate = {
					type: 'create',
					chat: this.data.users[i].id,
					user: this.sessionData.current.id,
					publication: this.data.item.id,
					action: 'publication'
				}

				this.chatDataService.comment(dataCreate).subscribe();
			}
		}

		this.alertService.success(this.translations.sentSuccessfully);
		this.close();
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
					chat: this.data.current.id,
					user: this.sessionData.current.id,
					content: formatedData.content,
					content_original: formatedData.original,
					action: 'text'
				}

				this.chatDataService.comment(dataCreate)
					.subscribe((res: any) => {
						this.dataDefault.list.push(res);
						item.noData = false;

						// Clear comment box
						this.newComment('clear', null, item);

						// Scroll to bottom
						this.scrollToBottom();
					}, error => {
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			}
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

	// Show photo from url if is one
	showShared(item) {
		if (item.type == 'publication') {
			let data = {
				name: item.publication.name,
				session: this.sessionData.current.id
			}

			this.publicationsDataService.getDataByName(data)
				.subscribe((res: any) => {
					this.location.go(this.router.url + '#publication');

					let config = {
						disableClose: false,
						data: {
							comeFrom: 'notifications',
							translations: this.translations,
							sessionData: this.sessionData,
							userData: (res ? res.user : null),
							item: (res ? res : null)
						}
					};

					// Open dialog
					let dialogRef = this.dialog.open(ShowPublicationComponent, config);
					dialogRef.afterClosed().subscribe((result: any) => {
						this.location.go(this.router.url);
					});
				});
		} else if (item.type == 'photo') {
			// code...
		} else if (item.type == 'audio') {
			// code...
		}
	}

	// Item options
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

				this.chatDataService.addRemoveComment(dataAddRemove).subscribe();
				break;
			case "report":
				item.type = 'notification';
				item.translations = this.translations;
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Close dialog
	close(){
		this.data.close = true;
		
		// On close check if is new so then add to the list on component page
		if (this.dataDefault.list.length > 0) {
			this.data.list = this.dataDefault.list;

			this.data.last = {
				content: this.dataDefault.list[this.dataDefault.list.length-1].content,
				date: this.dataDefault.list[this.dataDefault.list.length-1].date,
				type: this.dataDefault.list[this.dataDefault.list.length-1].type ? this.dataDefault.list[this.dataDefault.list.length-1].type : 'text'
			};
		}

		this.dialogRef.close(this.data);
	}
}
