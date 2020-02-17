import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Location, DOCUMENT } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';

import { NewPublicationAddPhotosComponent } from './addPhotos/addPhotos.component';
import { NewPublicationAddAudiosComponent } from './addAudios/addAudios.component';

declare var global: any;

@Component({
	selector: 'app-new-ublication',
	templateUrl: './newPublication.component.html'
})
export class NewPublicationComponent implements OnInit {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public submitLoading: boolean;
	public errorMessage: any;
	public openPhotoBox: boolean;
	public searchBoxMentions: boolean;
	public actionFormSearchMentions: FormGroup;
	public searchMentionsData: any = [];
	public publicationData: any = {
		original: '',
		transformed: '',
		onBackground: '',
		eventTarget: '',
		lastTypedWord: []
	};
	public audioPlayerData: any = [];

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewPublicationComponent>,
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private location: Location,
		private sanitizer: DomSanitizer,
		private alertService: AlertService,
		private playerService: PlayerService,
		private userDataService: UserDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService
	) {
		this.data.photosArray = [];
		this.data.audiosArray = [];
		this.data.counterUploaded = 0;
		this.sessionData = this.data.sessionData;
		this.translations = this.data.translations;

		// Set placeholder
		this.checkPlaceholder();
	}

	ngOnInit() {
		// Search mentions
		this.actionFormSearchMentions = this._fb.group({
			search: ['']
		});

		// Get mentions
		this.actionFormSearchMentions.get('search').valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged())
			.subscribe(val => {
				const data = {
					caption: val,
					cuantity: 5
				};

				this.userDataService.searchMentions(data)
					.subscribe((res: any) => {
						if (res.length > 0) {
							if (this.publicationData.lastTypedWord.word.indexOf('@') > -1) {
								this.searchMentionsData = res;
								this.searchBoxMentions = true;
							} else {
								this.searchBoxMentions = false;
							}
						} else {
							this.searchBoxMentions = false;
						}
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
			});
	}

	openPhotos(event: Event) {
		this.location.go('/' + this.sessionData.current.username + '#newPublication#addPhotos');
		const config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				translations: this.translations,
				array: this.data.photosArray,
				list: this.data.photosList,
				rows: this.data.photosRows,
				loadMore: this.data.photosLoadMore,
				countUploads: (this.data.photosCountUploads ? this.data.photosCountUploads : 0),
			}
		};

		const dialogRef = this.dialog.open(NewPublicationAddPhotosComponent, config);
		dialogRef.afterClosed().subscribe((res: any) => {
			this.location.go('/' + this.sessionData.current.username + '#newPublication');

			this.data.photosArray = res.array;
			this.data.photosList = res.list;
			this.data.photosRows = res.rows;
			this.data.photosLoadMore = res.loadMore;
			this.data.photosCountUploads = res.countUploads;
		});
	}

	openAudios(event: Event) {
		this.location.go('/' + this.sessionData.current.username + '#newPublication#addAudios');
		const config = {
			disableClose: false,
			data: {
				active: 'default',
				sessionData: this.sessionData,
				translations: this.translations,
				array: this.data.audiosArray,
				list: this.data.audiosList,
				rows: this.data.audiosRows,
				loadMore: this.data.audiosLoadMore,
				countUploads: (this.data.audiosCountUploads ? this.data.audiosCountUploads : 0)
			}
		};

		const dialogRef = this.dialog.open(NewPublicationAddAudiosComponent, config);
		dialogRef.afterClosed().subscribe((res: any) => {
			this.location.go('/' + this.sessionData.current.username + '#newPublication');

			this.data.audiosArray = res.array;
			this.data.audiosList = res.list;
			this.data.audiosRows = res.rows;
			this.data.audiosLoadMore = res.loadMore;
			this.data.audiosCountUploads = res.countUploads;
		});
	}

	playSong(data, item, key, type) {
		if (!this.sessionData) {
			this.alertService.success(this.translations.common.createAnAccountToListenSong);
		} else {
			if (item.id === 0) {
				this.alertService.warning(this.translations.common.songNotUploaded);
			} else {
				if (this.audioPlayerData.key === key &&
					this.audioPlayerData.type === type &&
					this.audioPlayerData.item.song === item.song
				) { // Play/Pause current
					item.playing = !item.playing;
					this.playerService.setPlayTrack(this.audioPlayerData);
				} else { // Play new one
					this.audioPlayerData.list = data;
					this.audioPlayerData.item = item;
					this.audioPlayerData.key = key;
					this.audioPlayerData.user = this.sessionData.current.id;
					this.audioPlayerData.username = this.sessionData.current.username;
					this.audioPlayerData.location = 'newPublication';
					this.audioPlayerData.type = type;
					this.audioPlayerData.selectedIndex = this.data.selectedIndex;

					this.playerService.setData(this.audioPlayerData);
					item.playing = true;
				}
			}
		}
	}

	toggleItem(type, item) {
		if (type === 'photos') {
			if (item.selected) {
				for (const i in this.data.photosArray) {
					if (i) {
						if (item.up_name) {
							if (this.data.photosArray[i].up_name === item.up_name) {
								this.data.photosArray.splice(i, 1);
								item.selected = false;
							}
						}
					}
				}
			} else {
				this.data.photosArray.push(item);
				item.selected = true;
			}
		} else if (type === 'audios') {
			if (item.selected) {
				for (const i in this.data.audiosArray) {
					if (i) {
						if (item.up_name) {
							if (this.data.audiosArray[i].up_name === item.up_name) {
								this.data.audiosArray.splice(i, 1);
								item.selected = false;
							}
						} else {
							if (this.data.audiosArray[i].name === item.name) {
								this.data.audiosArray.splice(i, 1);
								item.selected = false;
							}
						}
					}
				}
			} else {
				this.data.audiosArray.push(item);
				item.selected = true;
			}
		}
	}

	writingChanges(innerText) {
		const self = this;
		let str = innerText;
		this.publicationData.original = innerText;

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
		str = str.replace(this.env.urlRegex, function(value) {
			return '<span class="url">' + value + '</span>';
		});

		// generate clear content
		this.publicationData.transformed = str;

		// check empty contenteditable
		this.checkPlaceholder();
	}

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

	checkKeyCode(event) {
		// Space, Enter, Escape
		if (event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 27) {
			this.searchBoxMentions = false;
		} else {
			if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
				this.searchBoxMentions = false;
			} else {
				this.publicationData.eventTarget = event.target;
				const position = this.getCaretPosition(event.target);
				const word = this.getCurrentWord(event.target, position);

				this.publicationData.lastTypedWord = {
					word: word,
					position: position
				};

				// Detect mention in word
				if (word.indexOf('@') > -1 && word.length > 1) {
					this.actionFormSearchMentions.get('search').setValue(word.substr(1));
				} else {
					this.searchBoxMentions = false;
				}
			}
		}
	}

	checkPlaceholder() {
		if (this.publicationData.original.length === 0) {
			this.publicationData.transformed = '<div class="placeholder">' + this.translations.main.whatsHappening.one + '<br>' + this.translations.main.whatsHappening.two + '</div>';
		}
	}

	validateBeforeSubmit(data) {
		// validate if exists audios or photos
		if (data.audiosArray.length > 0 || data.photosArray.length > 0) {
			data.saveDisabled = false;
		} else {
			data.saveDisabled = true;
		}

		// validate array audios
		for (const i of data.audiosArray) {
			if (i) {
				if (i.status === 'error') {
					data.saveDisabled = true;
				}
			}
		}

		// validate array photos
		for (const i of data.photosArray) {
			if (i) {
				if (i.status === 'error') {
					data.saveDisabled = true;
				}
			}
		}

		// validate text, array audios & photos and youtube/vimeo url
		const valid = (this.publicationData.original.length === 0 && // validate text
						data.saveDisabled) ? false : true; // validate existing audios or photos

		return valid;
	}

	transformBeforeSubmit(data) {
		const newData = {
			content: data ? data : '',
			original: this.publicationData.original ? this.publicationData.original : '',
			mentions: [],
			hashtags: []
		};

		// new line
		newData.content = newData.content.replace(/\n/g, '<br>');

		// hashtag
		newData.content = newData.content.replace(/(#)\w+/g, function(value) {
			newData.hashtags.push(value);
			return '<a class="hashtag">' + value + '</a>';
		});

		// mention
		newData.content = newData.content.replace(/(@)\w+/g, function(value) {
			newData.mentions.push(value);
			return '<a class="mention">' + value + '</a>';
		});

		// detect url
		newData.content = newData.content.replace(this.env.urlRegex, function(value) {
			return '<a class="url">' + value + '</a>';
		});

		return newData;
	}

	setSelectionRange() {
		const el = this.publicationData.eventTarget;

		// Check the diference between positions this.publicationData.lastTypedWord.word & this.publicationData.lastTypedWord.searched
		const a = this.publicationData.lastTypedWord.word.length;
		const b = this.publicationData.lastTypedWord.searched.length;
		const c = b - a;

		// TODO: Check if is last word on content then add space

		const range = document.createRange();
		range.setStart(el.childNodes[0], this.publicationData.lastTypedWord.position + c);
		range.collapse(true);

		const sel = this.window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);

		el.focus();
	}

	addSearchedMention(data) {
		this.publicationData.lastTypedWord.searched = '@' + data.user.username;
		this.publicationData.onBackground = this.publicationData.original.replace(this.publicationData.lastTypedWord.word, '@' + data.user.username);
		this.writingChanges(this.publicationData.onBackground);
		this.searchBoxMentions = false;

		setTimeout(() => {
			this.setSelectionRange();
		}, 300);
	}

	submit() {
		const validate = this.validateBeforeSubmit(this.data);

		if (validate) {
			this.submitLoading = true;
			const formatedData = this.transformBeforeSubmit(this.publicationData.original);
			const photosArray = [];
			const audiosArray = [];

			for (const i of this.data.photosArray) {
				if (i) {
					const a = {
						id: 		i.uploaded ? i.id : i.photo,
						name: 		i.uploaded ? i.up_name : i.name,
						mimetype: 	i.uploaded ? i.up_type : i.type,
						duration: 	i.uploaded ? i.up_duration : i.duration,
						uploaded: 	i.uploaded ? true : false
					};

					photosArray.push(a);
				}
			}

			for (const i of this.data.audiosArray) {
				if (i) {
					const a = {
						id: 				i.uploaded ? i.id : i.song,
						song: 				i.uploaded ? '' : i.song,
						name: 				i.uploaded ? i.up_name : i.name,
						original_title: 	i.uploaded ? i.up_original_title : i.title,
						original_artist: 	i.uploaded ? i.up_original_artist : i.title,
						genre: 				i.uploaded ? i.up_genre : '',
						image:				i.uploaded ? i.up_image : '',
						duration: 			i.uploaded ? i.up_duration : '',
						uploaded: 			i.uploaded ? true : false
					};

					audiosArray.push(a);
				}
			}

			if (this.publicationData.original.length <= 3000) {
				const data = {
					content: 			formatedData.content,
					contentOriginal: 	this.publicationData.original,
					mentions: 			formatedData.mentions,
					hashtags: 			formatedData.hashtags,
					photos: 			(photosArray.length > 0 ? photosArray : ''),
					audios: 			(audiosArray.length > 0 ? audiosArray : '')
				};

				this.publicationsDataService.createPublication(data)
					.subscribe(res => {
						this.dialogRef.close(res);
						this.submitLoading = false;
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
						this.submitLoading = false;
					});
			} else {
				this.alertService.error(this.translations.common.textIsToLong);
			}
		} else {
			this.alertService.warning(this.translations.main.addSomeContent);
		}
	}

	close() {
		this.dialogRef.close();
	}
}
