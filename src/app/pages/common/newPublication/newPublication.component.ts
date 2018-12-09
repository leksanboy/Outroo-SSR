import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';

import { NewPublicationAddPhotosComponent } from './addPhotos/addPhotos.component';
import { NewPublicationAddAudiosComponent } from './addAudios/addAudios.component';

declare var global: any;

@Component({
	selector: 'app-newPublication',
	templateUrl: './newPublication.component.html'
})
export class NewPublicationComponent implements OnInit {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public saveLoading: boolean;
	public errorMessage: any;
	public openPhotoBox: boolean;
	public searchBoxMentions: boolean;
	public actionFormSearchMentions: FormGroup;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;
	public searchMentionsData: any = [];
	public publicationData: any = {
		original: '',
		transformed: '',
		onBackground: '',
		eventTarget: '',
		lastTypedWord: []
	};

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewPublicationComponent>,
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private location: Location,
		private sanitizer: DomSanitizer,
		private alertService: AlertService,
		private userDataService: UserDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService
	) {
		this.data.photosArray = [];
		this.data.audiosArray = [];
		this.data.urlVideo = [];
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
				let data = {
					caption: val,
					cuantity: 5
				}

				this.userDataService.searchMentions(data)
					.subscribe(res => {
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
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			});
	}

	// Open dialog photos
	openPhotos(event: Event){
		this.location.go('/' + this.sessionData.current.username + '#newPublication#addPhotos');
		let config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				translations: this.translations,
				array: this.data.photosArray,
				list: this.data.photosList,
				rows: this.data.photosRows,
				loadMore: this.data.photosLoadMore
			}
		};

		let dialogRef = this.dialog.open(NewPublicationAddPhotosComponent, config);
		dialogRef.afterClosed().subscribe((res: any) => {
			this.location.go('/' + this.sessionData.current.username + '#newPublication');

			this.data.photosArray = res.array;
			this.data.photosList = res.list;
			this.data.photosRows = res.rows;
			this.data.photosLoadMore = res.loadMore;
		});
	}

	// Open dialog audios
	openAudios(event: Event){
		this.location.go('/' + this.sessionData.current.username + '#newPublication#addAudios');
		let config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				translations: this.translations,
				array: this.data.audiosArray,
				list: this.data.audiosList,
				rows: this.data.audiosRows,
				loadMore: this.data.audiosLoadMore
			}
		};

		let dialogRef = this.dialog.open(NewPublicationAddAudiosComponent, config);
		dialogRef.afterClosed().subscribe((res: any) => {
			this.location.go('/' + this.sessionData.current.username + '#newPublication');

			this.data.audiosArray = res.array;
			this.data.audiosList = res.list;
			this.data.audiosRows = res.rows;
			this.data.audiosLoadMore = res.loadMore;
		});
	}

	// Upload files
	uploadFiles(type, event){
		let convertToMb = function(bytes) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes))
				return '-';

			let units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));

			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) +  ' ' + units[number];
		}

		if (type == 1) { // Add files
			for (let i = 0; i < event.currentTarget.files.length; i++) {
				let file = event.currentTarget.files[i];
				file.title = file.name.replace('.mp3', '');
				file.user = this.sessionData.current.id;
				file.id = '000' + this.data.counterUploaded++;
				file.uploaded = true;
				file.selected = true;

				if (/^audio\/\w+$/.test(file.type)) {
					file.category = 'audio';

					if (file.size >= 20000000) {
						file.sizeBig = convertToMb(file.size);
						file.status = 'error';
					} else {
						this.uploadFiles(2, file);
					}

					this.data.audiosArray.push(file);
				} else if (/^image\/\w+$/.test(file.type)) {
					file.category = 'image';
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.addEventListener("load", function(e) {
						file.thumbnail = e.target;
						file.thumbnail = file.thumbnail.result;
					});

					if (file.size >= 20000000) {
						file.sizeBig = convertToMb(file.size);
						file.status = 'error';
					} else {
						this.uploadFiles(2, file);
					}

					this.data.photosArray.push(file);
				} else if (/^video\/\w+$/.test(file.type)) {
					file.category = 'video';
					file.thumbnail = URL.createObjectURL(file);
					file.thumbnail = this.sanitizer.bypassSecurityTrustUrl(file.thumbnail);

					if (file.size >= 20000000) {
						file.sizeBig = convertToMb(file.size);
						file.status = 'error';
					} else {
						this.uploadFiles(2, file);
					}

					this.data.photosArray.push(file);
				} else {
					file.status = 'error';
					this.data.photosArray.push(file);
				}
			}
		} else if (type == 2) { // Upload one by one
			let self = this;

			const ajaxCall = function(file, formdata, ajax){
				formdata.append("fileUpload", file);
				formdata.append("user", file.user);
				formdata.append("category", file.category);
				formdata.append("title", file.title);

				ajax.upload.addEventListener("progress", function(ev){
					progressHandler(ev, file);
				}, false);

				ajax.addEventListener("load", function(ev){
					completeHandler(ev, file);
				}, false);

				ajax.addEventListener("error", function(ev){
					errorHandler(ev, file);
				}, false);

				ajax.addEventListener("abort", function(ev){
					abortHandler(ev, file);
				}, false);

				ajax.open("POST", "./assets/api/publications/uploadFiles.php");
				ajax.send(formdata);
			}

			const progressHandler = function(event, file) {
				file.status = 'progress';

				let percent = Math.round((event.loaded / event.total) * 100);
				file.progress = Math.max(0, Math.min(100, percent));
			}

			const completeHandler = function(event, file) {
				let response = JSON.parse(event.currentTarget.response);

				file.status = 'completed';
				file.up_name = response.name;
				file.up_type = response.type ? response.type : '';
				file.up_original_title = response.original_title ? response.original_title : '';
				file.up_original_artist = response.original_artist ? response.original_artist : '';
				file.up_genre = response.genre ? response.genre : '';
				file.up_image = response.image ? response.image : '';
				file.up_duration = response.duration ? response.duration : '';
			}

			const errorHandler = function(event, file) {
				file.status = 'error';
				disableHandler();
			}

			const abortHandler = function(event, file) {
				file.status = 'error';
				disableHandler();
			}

			const disableHandler = function(){
				self.data.saveDisabled = true;
			}

			// Call method
			let file = event,
				formdata = new FormData(),
				ajax = new XMLHttpRequest();

			ajaxCall(file, formdata, ajax);
		}
	}

	// Select/unselect files
	toggleItem(type, item){
		if (type == 'photos') {
			if (item.selected) {
				for (let i in this.data.photosArray)
					if (this.data.photosArray[i].id == item.id)
						this.data.photosArray.splice(i, 1);

				item.selected = false;
			} else {
				this.data.photosArray.push(item);
				item.selected = true;
			}
		} else if (type == 'audios') {
			if (item.selected) {
				for (let i in this.data.audiosArray)
					if (this.data.audiosArray[i].id == item.id)
						this.data.audiosArray.splice(i, 1);

				item.selected = false;
			} else {
				this.data.audiosArray.push(item);
				item.selected = true;
			}
		}
	}

	// Writing post and parsing
	writingChanges(innerText){
		let self = this;
		let str = innerText;
		this.publicationData.original = innerText;
		
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

		// generate clear content
		this.publicationData.transformed = str;

		//check empty contenteditable
		this.checkPlaceholder();
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

	// Cehck pressing key
	checkKeyCode(event){
		// Space, Enter, Escape
		if (event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 27) {
			this.searchBoxMentions = false;
		} else {
			if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
				this.searchBoxMentions = false;
			} else {
				this.publicationData.eventTarget = event.target;
				let position = this.getCaretPosition(event.target);
				let word = this.getCurrentWord(event.target, position);
				this.publicationData.lastTypedWord = {
					word: word,
					position: position
				};

				// Detect mention in word
				if (word.indexOf('@') > -1 && word.length > 1)
					this.actionFormSearchMentions.get('search').setValue(word.substr(1));
				else
					this.searchBoxMentions = false;
			}
		}
	}

	// Check if content is empty to set placeholer
	checkPlaceholder(){
		if (this.publicationData.original.length == 0)
			this.publicationData.transformed = '<div class="placeholder">' + this.translations.whatsHappening.one +
											'<br>' + this.translations.whatsHappening.two + '</div>';
	}

	// Validate post content
	validateBeforeSubmit(data){
		// validate if exists audios or photos
		if (data.audiosArray.length > 0 || data.photosArray.length > 0)
			data.saveDisabled = false;
		else
			data.saveDisabled = true;

		// validate array audios
		for (let i in data.audiosArray)
			if (data.audiosArray[i].status == 'error')
				data.saveDisabled = true;

		// validate array photos
		for (let i in data.photosArray)
			if (data.photosArray[i].status == 'error')
				data.saveDisabled = true;

		// validate text, array audios & photos and youtube/vimeo url
		let valid = (this.publicationData.original.length == 0 && // validate text
					data.saveDisabled && // validate existing audios or photos
					!data.urlVideo.exists) ? false : true; // validate youtube/vimeo url video

		return valid;
	}

	// Transform content of the post and send
	transformBeforeSubmit(data){
		let newData = {
			content: data ? data : '',
			original: this.publicationData.original ? this.publicationData.original : '',
			mentions: [],
			hashtags: []
		}

		// new line
		newData.content = newData.content.replace(/\n/g, '<br>');

		// hashtag
		newData.content = newData.content.replace(/(#)\w+/g, function(value){
			newData.hashtags.push(value);
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
	}

	// Set caret position
	setSelectionRange() {
		let el = this.publicationData.eventTarget;

		// Check the diference between positions this.publicationData.lastTypedWord.word & this.publicationData.lastTypedWord.searched
		let a = this.publicationData.lastTypedWord.word.length;
		let b = this.publicationData.lastTypedWord.searched.length;
		let c = b - a;

		// TODO: Check if is last word on content then add space

		let range = document.createRange();
		range.setStart(el.childNodes[0], this.publicationData.lastTypedWord.position + c);
		range.collapse(true);
		
		let sel = this.window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
		
		el.focus();
	}

	// Add mention from mentions serch list
	addSearchedMention(data){
		this.publicationData.lastTypedWord.searched = '@'+data.user.username;
		this.publicationData.onBackground = this.publicationData.original.replace(this.publicationData.lastTypedWord.word, '@' + data.user.username);
		this.writingChanges(this.publicationData.onBackground);
		this.searchBoxMentions = false;

		setTimeout(() => {
			this.setSelectionRange();
		}, 300);
	}

	// Video information from url YouTube/vimeo
	urlVideoInformation(type, url){
		if (type === 1) {
			this.data.urlVideo = [];
			let data = {
				type: 'other',
				url: url
			}

			// Check type
			if (url.indexOf('youtu') > -1)
				data.type = 'youtube';
			else if (url.indexOf('vimeo') > -1)
				data.type = 'vimeo';
			else
				data.type = 'other';

			// Get data
			this.publicationsDataService.urlVideoInformation(data)
				.subscribe(res => {
					if (res) {
						if (data.type === 'youtube')
							this.data.urlVideo = {
								exists: true,
								url: data.url,
								type: 'YouTube',
								title: res.title,
								channel: res.author_name,
								thumbnail: res.thumbnail_url,
								iframe: res.iframe
							}
						else if (data.type === 'vimeo')
							this.data.urlVideo = {
								exists: true,
								url: data.url,
								type: 'Vimeo',
								title: res.title,
								channel: res.user_name,
								thumbnail: res.thumbnail_large,
								iframe: res.iframe
							}
						else
							this.data.urlVideo = {
								exists: true,
								url: data.url,
								type: 'Other',
								title: null,
								channel: null,
								thumbnail: null,
								iframe: null
							}
					} else {
						this.data.urlVideo = [];
						this.data.urlVideo.exists = false;
						this.alertService.error(this.translations.invalidUrlVideo);
					}
				}, error => {
					this.data.urlVideo = [];
					this.data.urlVideo.exists = false;
					this.alertService.error(this.translations.invalidUrlVideo);
				});
		} else if (type === 2) {
			this.data.urlVideo = [];
			this.data.urlVideo.exists = false;
		}
	}

	// Create publication
	submit(){
		let validate = this.validateBeforeSubmit(this.data);

		if(validate){
			this.saveLoading = true;
			let formatedData = this.transformBeforeSubmit(this.publicationData.original);
			let photosData = [];

			for (let i in this.data.photosArray) {
				let a = {
					id: this.data.photosArray[i].uploaded ? this.data.photosArray[i].id : this.data.photosArray[i].photo,
					name: this.data.photosArray[i].uploaded ? this.data.photosArray[i].up_name : this.data.photosArray[i].name,
					mimetype: this.data.photosArray[i].uploaded ? this.data.photosArray[i].up_type : this.data.photosArray[i].type,
					duration: this.data.photosArray[i].uploaded ? this.data.photosArray[i].up_duration : this.data.photosArray[i].duration,
					uploaded: this.data.photosArray[i].uploaded ? true : false
				}

				photosData.push(a);
			}

			let data = {
				user: this.sessionData.current.id,
				content: formatedData.content,
				contentOriginal: this.publicationData.original,
				mentions: formatedData.mentions,
				hashtags: formatedData.hashtags,
				urlVideo: this.data.urlVideo,
				photos: (photosData.length > 0 ? photosData : ''),
				audios: (this.data.audiosArray.length > 0 ? this.data.audiosArray : ''),
			}

			this.publicationsDataService.createPublication(data)
				.subscribe(res => {
					this.dialogRef.close(res);
					this.saveLoading = false;
				}, error => {
					this.alertService.error(this.translations.anErrorHasOcurred);
					this.saveLoading = false;
				});
		} else {
			this.alertService.error(this.translations.addContentBeforeSubmitPublication);
		}
	}

	// Close
	close(){
		this.dialogRef.close();
	}
}
