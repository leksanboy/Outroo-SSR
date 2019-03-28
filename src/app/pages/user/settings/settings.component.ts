import { DOCUMENT, DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SsrService } from '../../../../app/core/services/ssr.service';

import { NewAvatarComponent } from '../../../../app/pages/common/newAvatar/newAvatar.component';
import { NewSessionComponent } from '../../../../app/pages/common/newSession/newSession.component';

declare var ga: Function;
declare var global: any;

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public activeRouter: any;
	public activeLanguage: any;
	public actionFormPersonalData: any;
	public actionFormPasswordData: any;
	public savePersonalDataLoading: boolean;
	public savePasswordDataLoading: boolean;
	public validatorUsername: string;
	public validatorOldPassword: string;
	public validatorNewPassword: string;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private _fb: FormBuilder,
		public dialog: MatDialog,
		private location: Location,
		private titleService: Title,
		private sanitizer: DomSanitizer,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private ssrService: SsrService
	) {
		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

		// Exit if no session
		if (!this.sessionData)
			this.userDataService.noSessionData();

		// Set component data
		this.activeRouter = this.router.events
			.subscribe(event => {
				if(event instanceof NavigationEnd) {
					// Go top of page on change user
					if (this.ssrService.isBrowser) {
						this.window.scrollTo(0, 0);
					}

					// Set Google analytics
					let urlGa =  '[' + this.sessionData.current.id + ']/settings';
					ga('set', 'page', urlGa);
					ga('send', 'pageview');

					// Set froms
					this.setForms(this.sessionData.current);
				}
			});

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				let lang = data.current.language;
				this.getTranslations(lang);
			});
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeLanguage.unsubscribe();
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
				this.titleService.setTitle(this.translations.settings);
			});
	}

	// Set forms
	setForms(data){
		this.validatorUsername = null;
		this.validatorNewPassword = null;
		this.validatorOldPassword = null;

		// Personal data form
		this.actionFormPersonalData = this._fb.group({
			theme: [data.theme],
			private: [data.private],
			username: [data.username, [Validators.required]],
			name: [data.name, [Validators.required]],
			language: [data.language, [Validators.required]]
		});

		// Dark theme
		this.actionFormPersonalData.get('theme').valueChanges
			.subscribe(val => {
				if (val) {
					this.document.body.classList.add('darkTheme');
					this.alertService.success(this.translations.darkThemeEnabled);
				} else {
					this.document.body.classList.remove('darkTheme');
					this.alertService.success(this.translations.darkThemeDisabled);
				}

				let data = {
					id: this.sessionData.current.id,
					theme: this.actionFormPersonalData.get('theme').value
				}

				this.userDataService.updateTheme(data)
					.subscribe(res => {
						setTimeout(() => {
							this.sessionData = this.userDataService.getSessionData();
							this.sessionService.setDataTheme(this.sessionData);
						}, 1000);
					}, error => {
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			});

		// Private account
		this.actionFormPersonalData.get('private').valueChanges
			.subscribe(val => {
				if (val)
					this.alertService.success(this.translations.privateAccountEnabled);
				else
					this.alertService.success(this.translations.privateAccountDisabled);
							
				let data = {
					id: this.sessionData.current.id,
					private: this.actionFormPersonalData.get('private').value
				}

				this.userDataService.updatePrivate(data)
					.subscribe(res => {
						setTimeout(() => {
							this.sessionData = this.userDataService.getSessionData();
							this.sessionService.setData(this.sessionData);
						}, 1000);
					}, error => {
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			});

		// Validate username
		this.actionFormPersonalData.get('username').valueChanges
			.subscribe(val => {
				this.actionFormPersonalData.controls['username'].setErrors({ validate: false });
			});
		this.actionFormPersonalData.get('username').valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged())
			.subscribe(val => {
				this.validatorUsername = 'load';
				let regex = /^[a-zA-Z0-9._-]+$/;

				if (val != '' && regex.test(val)) {
					this.userDataService.checkUsername(val).subscribe(
						res => {
							setTimeout(() => {
								if (res) {
									if (val == data.username) {
										this.actionFormPersonalData.controls['username'].setErrors(null);
										this.validatorUsername = 'done';
									} else {
										this.actionFormPersonalData.controls['username'].setErrors({ validate: false });
										this.validatorUsername = 'bad';
									}
								} else {
									this.actionFormPersonalData.controls['username'].setErrors(null);
									this.validatorUsername = 'done';
								}
							}, 600);
						}
					);
				} else {
					this.actionFormPersonalData.controls['username'].setErrors({ validate: false });
					this.validatorUsername = 'bad';
				}
			});

		// Password data form
		this.actionFormPasswordData = this._fb.group({
			oldPassword: [''],
			newPassword: [''],
			confirmPassword: ['']
		});

		// New password
		this.actionFormPasswordData.get('newPassword').valueChanges
			.subscribe(val => {
				this.actionFormPasswordData.controls['newPassword'].setErrors({ validate: false });
				this.validatorNewPassword = 'load';

				if (val.trim() != '') {
					setTimeout(() => {
						if(val == this.actionFormPasswordData.get('confirmPassword').value){
							this.actionFormPasswordData.controls['confirmPassword'].setErrors(null);
							this.actionFormPasswordData.controls['newPassword'].setErrors(null);
							this.validatorNewPassword = 'done';
						} else {
							this.actionFormPasswordData.controls['newPassword'].setErrors({ validate: false });
							this.validatorNewPassword = 'bad';
						}
					}, 1000);
				} else {
					this.actionFormPasswordData.controls['newPassword'].setErrors({ validate: false });
					this.validatorNewPassword = 'bad';
				}
			});

		// Confirm password
		this.actionFormPasswordData.get('confirmPassword').valueChanges
			.subscribe(val => {
				this.actionFormPasswordData.controls['confirmPassword'].setErrors({ validate: false });
				this.validatorNewPassword = 'load';

				if (val.trim() != '') {
					setTimeout(() => {
						if(val == this.actionFormPasswordData.get('newPassword').value){
							this.actionFormPasswordData.controls['newPassword'].setErrors(null);
							this.actionFormPasswordData.controls['confirmPassword'].setErrors(null);
							this.validatorNewPassword = 'done';
						} else {
							this.actionFormPasswordData.controls['confirmPassword'].setErrors({ validate: false });
							this.validatorNewPassword = 'bad';
						}
					}, 1000);
				} else {
					this.actionFormPasswordData.controls['confirmPassword'].setErrors({ validate: false });
					this.validatorNewPassword = 'bad';
				}
			});
	}

	// Change avatar/background
	openAvatar(type, action, event) {
		switch (type) {
			case "avatar":
				if (action == 'upload') {
					let file = event.target.files[0];

					if (/^image\/\w+$/.test(file.type)) {
						file = URL.createObjectURL(file);
						this.sessionData.current.avatarCropper = this.sanitizer.bypassSecurityTrustUrl(file);
						this.location.go('/settings#avatar');

						let config = {
							disableClose: false,
							data: {
								sessionData: this.sessionData,
								translations: this.translations,
								comeFrom: 'avatar'
							}
						};

						let dialogRef = this.dialog.open(NewAvatarComponent, config);
						dialogRef.afterClosed().subscribe((res: string) => {
							this.location.go('/settings');

							if (res) {
								this.sessionData = res;
								this.sessionService.setData(this.sessionData);
								this.alertService.success(this.translations.avatarChanged);
							}
						});
					} else {
						this.alertService.error(this.translations.selectedFileIsNotImage);
					}
				} else if (type == 'remove') {
					this.sessionData.current.newAvatar = '';
					this.userDataService.updateAvatar(this.sessionData.current)
						.subscribe(res => {
							this.sessionData = res;
							this.sessionService.setData(this.sessionData);
							this.alertService.success(this.translations.avatarRemoved);
						});
				}
				break;
			case "background":
				if (action == 'upload') {
					let file = event.target.files[0];

					if (/^image\/\w+$/.test(file.type)) {
						file = URL.createObjectURL(file);
						this.sessionData.current.backgroundCropper = this.sanitizer.bypassSecurityTrustUrl(file);
						this.location.go('/settings#background');

						let config = {
							disableClose: false,
							data: {
								sessionData: this.sessionData,
								translations: this.translations,
								comeFrom: 'background'
							}
						};

						let dialogRef = this.dialog.open(NewAvatarComponent, config);
						dialogRef.afterClosed().subscribe((res: string) => {
							this.location.go('/settings');

							if (res) {
								this.sessionData = res;
								this.sessionService.setData(this.sessionData);
								this.alertService.success(this.translations.backgroundChanged);
							}
						});
					} else {
						this.alertService.error(this.translations.selectedFileIsNotImage);
					}
				} else if (type == 'remove') {
					this.sessionData.current.newBackground = '';
					this.userDataService.updateBackground(this.sessionData.current)
						.subscribe(res => {
							this.sessionData = this.userDataService.getSessionData();
							this.sessionService.setData(this.sessionData);
							this.alertService.success(this.translations.backgroundRemoved);
						});
				}
				break;
		}
	}

	// About edit
	aboutEdit(type, event){
		if (type == 'writingChanges') {
			let str = event;
			this.sessionData.current.aboutWriting = event;

			if (str) {
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
				this.sessionData.current.about = str;
			}

			//check empty contenteditable
			this.aboutEdit('checkPlaceholder', event);
		} else if (type == 'checkPlaceholder') {
			event = event.trim();

			if (event.length == 0)
				this.sessionData.current.about = '<div class="placeholder">' + this.translations.aboutMeDescription + '</div>';
		} else if (type == 'transformBeforeSend') {
			let newData = {
				content: this.sessionData.current.aboutWriting ? this.sessionData.current.aboutWriting : this.sessionData.current.aboutOriginal,
				original: this.sessionData.current.aboutWriting ? this.sessionData.current.aboutWriting : this.sessionData.current.aboutOriginal
			}

			// new line
			newData.content = newData.content.replace(/\n/g, '<br>');

			// hashtag
			newData.content = newData.content.replace(/(#)\w+/g, function(value){
				return '<a class="hashtag">' + value + '</a>';
			});

			// mention
			newData.content = newData.content.replace(/(@)\w+/g, function(value){
				return '<a class="mention">' + value + '</a>';
			});

			// detect url
			newData.content = newData.content.replace(this.urlRegex, function(value){
				return '<a class="url">' + value + '</a>';
			});

			return newData;
		}
	}

	// Save personal data
	submitPersonal() {
		this.savePersonalDataLoading = true;
		
		let dataAbout = this.aboutEdit('transformBeforeSend', null),
		data = {
			id: this.sessionData.current.id,
			username: this.actionFormPersonalData.get('username').value,
			name: this.actionFormPersonalData.get('name').value.trim(),
			language: this.actionFormPersonalData.get('language').value,
			about: dataAbout.content,
			aboutOriginal: dataAbout.original
		};

		this.userDataService.updateData(data)
			.subscribe(res => {
				setTimeout(() => {
					this.savePersonalDataLoading = false;
					this.sessionData = this.userDataService.getSessionData();
					this.sessionService.setData(this.sessionData);

					// Get translations
					this.userDataService.getTranslations(this.sessionData.current.language)
						.subscribe(data => {
							this.translations = data;

							// Alert Message
							this.alertService.success(data.profileSaved);
						});
				}, 1000);
			}, error => {
				this.savePersonalDataLoading = false;
				this.alertService.error(this.translations.anErrorHasOcurred);
			});
	}

	// Save password data
	submitPassword() {
		this.savePasswordDataLoading = true;

		if (this.actionFormPasswordData.get('oldPassword').value.trim().length > 0 &&
			this.actionFormPasswordData.get('newPassword').value.trim().length > 0 &&
			this.actionFormPasswordData.get('confirmPassword').value.trim().length > 0
		) {
			let data = {
				id: this.sessionData.current.id,
				oldPassword: this.actionFormPasswordData.get('oldPassword').value,
				newPassword: this.actionFormPasswordData.get('newPassword').value
			}

			this.userDataService.updatePassword(data)
				.subscribe(res => {
					setTimeout(() => {
						this.validatorOldPassword = 'done';
						this.savePasswordDataLoading = false;
						this.alertService.success(this.translations.passwordChanged);
					}, 1000);
				}, error => {
					this.validatorOldPassword = 'bad';
					this.savePasswordDataLoading = false;
					this.alertService.error(this.translations.oldPasswordIncorrect);
				});
		} else {
			this.savePasswordDataLoading = false;

			// show error message
			this.alertService.error(this.translations.completeAllFields);
		}

	}

	// Add more sessions
	openNewSession(){
		let dONS = {
			type: 'create',
			data: {
				sessionData: this.sessionData,
				translations: this.translations,
			}
		}

		this.sessionService.setDataAddAccount(dONS);
	}

	// Change user session
	setCurrentUser(data){
		if (this.sessionData.current.id != data.id) {
			let dSCU = {
				type: 'set',
				data: data
			}

			this.sessionService.setDataAddAccount(dSCU);
		}
	}

	// Close session
	closeSession(data){
		let dCS = {
			type: 'close',
			data: data
		}

		this.sessionService.setDataAddAccount(dCS);

		// Remove session
		for (var i in this.sessionData.sessions)
			if (this.sessionData.sessions[i].id == data.id)
				this.sessionData.sessions.splice(i, 1);

		// Set session after remove
		if (this.sessionData.sessions[0].id != data.id)
			this.sessionData.current = this.sessionData.sessions[0];
	}
}
