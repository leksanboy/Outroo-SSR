import { DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

import { NewAvatarComponent } from '../../../../app/pages/common/newAvatar/newAvatar.component';
import { NewSessionComponent } from '../../../../app/pages/common/newSession/newSession.component';

declare var global: any;

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public activeLanguage: any;
	public actionFormPersonalData: any;
	public actionFormPasswordData: any;
	public savePersonalDataLoading: boolean;
	public savePasswordDataLoading: boolean;
	public showPassword: boolean;
	public validatorUsername: string;
	public validatorOldPassword: string;
	public validatorNewPassword: string;

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
		private userDataService: UserDataService
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Data
		if (this.sessionData) {
			// Set title
			this.titleService.setTitle(this.translations.settings.title);

			// Set Google analytics
			const url = '[' + this.sessionData.current.id + ']/settings';
			this.userDataService.analytics(url);

			// Set froms
			this.setForms(this.sessionData.current);
		} else {
			this.userDataService.noSessionData();
		}

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				const lang = data.current.language;
				this.getTranslations(lang);
			});
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeLanguage.unsubscribe();
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
				this.titleService.setTitle(this.translations.settings.title);
			});
	}

	// Set forms
	setForms(form) {
		this.validatorUsername = null;
		this.validatorNewPassword = null;
		this.validatorOldPassword = null;

		// Personal data form
		this.actionFormPersonalData = this._fb.group({
			theme: [form.theme],
			private: [form.private],
			username: [form.username, [Validators.required]],
			name: [form.name, [Validators.required]],
			language: [form.language, [Validators.required]]
		});

		// Dark theme
		this.actionFormPersonalData.get('theme').valueChanges
			.subscribe(val => {
				if (val) {
					this.document.body.classList.add('darkTheme');
					this.alertService.success(this.translations.common.darkThemeEnabled);
				} else {
					this.document.body.classList.remove('darkTheme');
					this.alertService.success(this.translations.common.darkThemeDisabled);
				}

				const data = {
					theme: this.actionFormPersonalData.get('theme').value
				};

				this.userDataService.updateTheme(data)
					.subscribe(res => {
						setTimeout(() => {
							this.sessionData = this.userDataService.getSessionData();
							this.sessionService.setDataTheme(this.sessionData);
						}, 1000);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
			});

		// Private account
		this.actionFormPersonalData.get('private').valueChanges
			.subscribe(val => {
				if (val) {
					this.alertService.success(this.translations.common.privateEnabled);
				} else {
					this.alertService.success(this.translations.common.privateDisabled);
				}

				const data = {
					private: this.actionFormPersonalData.get('private').value
				};

				this.userDataService.updatePrivate(data)
					.subscribe(res => {
						setTimeout(() => {
							this.sessionData = this.userDataService.getSessionData();
							this.sessionService.setData(this.sessionData);
						}, 1000);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
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
				const regex = /^[a-zA-Z0-9._-]+$/;

				if (val !== '' && regex.test(val)) {
					this.userDataService.checkUsername(val)
						.subscribe(
							res => {
								setTimeout(() => {
									if (res) {
										if (val === form.username) {
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

				if (val.trim() !== '') {
					setTimeout(() => {
						if (val === this.actionFormPasswordData.get('confirmPassword').value) {
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

				if (val.trim() !== '') {
					setTimeout(() => {
						if (val === this.actionFormPasswordData.get('newPassword').value) {
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
			case 'avatar':
				if (action === 'upload') {
					let file = event.target.files[0];

					if (/^image\/\w+$/.test(file.type)) {
						file = URL.createObjectURL(file);
						this.sessionData.current.avatarCropper = this.sanitizer.bypassSecurityTrustUrl(file);
						this.location.go('/settings#avatar');

						const config = {
							disableClose: false,
							data: {
								sessionData: this.sessionData,
								translations: this.translations,
								comeFrom: 'avatar'
							}
						};

						const dialogRef = this.dialog.open(NewAvatarComponent, config);
						dialogRef.afterClosed().subscribe((res: string) => {
							this.location.go('/settings');

							if (res) {
								this.sessionData = res;
								this.sessionService.setData(this.sessionData);
								this.alertService.success(this.translations.common.savedSuccessfully);
							}
						});
					} else {
						this.alertService.error(this.translations.common.invalidFile);
					}
				} else if (action === 'remove') {
					this.sessionData.current.newAvatar = '';
					this.userDataService.updateAvatar(this.sessionData.current)
						.subscribe(res => {
							this.sessionData = res;
							this.sessionService.setData(this.sessionData);
							this.alertService.success(this.translations.common.savedSuccessfully);
						});
				}
				break;
			case 'background':
				if (action === 'upload') {
					let file = event.target.files[0];

					if (/^image\/\w+$/.test(file.type)) {
						file = URL.createObjectURL(file);
						this.sessionData.current.backgroundCropper = this.sanitizer.bypassSecurityTrustUrl(file);
						this.location.go('/settings#background');

						const config = {
							disableClose: false,
							data: {
								sessionData: this.sessionData,
								translations: this.translations,
								comeFrom: 'background'
							}
						};

						const dialogRef = this.dialog.open(NewAvatarComponent, config);
						dialogRef.afterClosed().subscribe((res: string) => {
							this.location.go('/settings');

							if (res) {
								this.sessionData = res;
								this.sessionService.setData(this.sessionData);
								this.alertService.success(this.translations.common.savedSuccessfully);
							}
						});
					} else {
						this.alertService.error(this.translations.common.invalidFile);
					}
				} else if (action === 'remove') {
					this.sessionData.current.newBackground = '';
					this.userDataService.updateBackground(this.sessionData.current)
						.subscribe(res => {
							this.sessionData = this.userDataService.getSessionData();
							this.sessionService.setData(this.sessionData);
							this.alertService.success(this.translations.common.savedSuccessfully);
						});
				}
				break;
		}
	}

	// About edit
	aboutEdit(type, event) {
		if (type === 'writingChanges') {
			let str = event;
			this.sessionData.current.aboutWriting = event;

			if (str) {
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

				// writing content
				this.sessionData.current.about = str;
			}

			// check empty contenteditable
			this.aboutEdit('checkPlaceholder', event);
		} else if (type === 'checkPlaceholder') {
			event = event.trim();

			if (event.length === 0) {
				this.sessionData.current.about = '<div class="placeholder">' + this.translations.settings.aboutPlaceholder + '</div>';
			}
		} else if (type === 'transformBeforeSend') {
			const newData = {
				content: this.sessionData.current.aboutWriting ? this.sessionData.current.aboutWriting : this.sessionData.current.aboutOriginal,
				original: this.sessionData.current.aboutWriting ? this.sessionData.current.aboutWriting : this.sessionData.current.aboutOriginal
			};

			// new line
			newData.content = newData.content.replace(/\n/g, '<br>');

			// hashtag
			newData.content = newData.content.replace(/(#)\w+/g, function(value) {
				return '<a class="hashtag">' + value + '</a>';
			});

			// mention
			newData.content = newData.content.replace(/(@)\w+/g, function(value) {
				return '<a class="mention">' + value + '</a>';
			});

			// detect url
			newData.content = newData.content.replace(this.env.urlRegex, function(value) {
				return '<a class="url">' + value + '</a>';
			});

			return newData;
		}
	}

	// Save personal data
	submitPersonal() {
		const dataAbout = this.aboutEdit('transformBeforeSend', null),
		form = this.actionFormPersonalData.value,
		regex = /^[a-zA-Z0-9._-]+$/,
		params = {
			username: form.username,
			name: form.name.trim(),
			language: form.language,
			about: dataAbout.content,
			aboutOriginal: dataAbout.original
		};

		if (params.username.trim().length === 0 || !regex.test(params.username)) {
			this.alertService.error(this.translations.settings.usernameRequirements);
		} else {
			this.savePersonalDataLoading = true;

			this.userDataService.updateData(params)
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
								this.alertService.success(this.translations.common.savedSuccessfully);
							});
					}, 1000);
				}, error => {
					this.savePersonalDataLoading = false;
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}

	}

	// Save password data
	submitPassword() {
		const form = this.actionFormPasswordData.value;

		if (form.oldPassword.trim().length > 0 &&
			form.newPassword.trim().length > 0 &&
			form.confirmPassword.trim().length > 0
		) {
			if (form.newPassword.trim() !== form.confirmPassword.trim()) {
				this.alertService.error(this.translations.settings.passwordsNotMatch);
			} else {
				this.savePasswordDataLoading = false;

				const data = {
					oldPassword: form.oldPassword,
					newPassword: form.newPassword
				};

				this.userDataService.updatePassword(data)
					.subscribe(res => {
						setTimeout(() => {
							this.validatorOldPassword = 'done';
							this.savePasswordDataLoading = false;
							this.alertService.success(this.translations.common.savedSuccessfully);
						}, 1000);
					}, error => {
						this.validatorOldPassword = 'bad';
						this.savePasswordDataLoading = false;
						this.alertService.error(this.translations.settings.oldPasswordIncorrect);
					});
			}
		} else {
			this.alertService.error(this.translations.common.completeAllFields);
		}
	}

	// Add more sessions
	openNewSession() {
		const dONS = {
			type: 'create',
			data: {
				sessionData: this.sessionData,
				translations: this.translations,
			}
		};

		this.sessionService.setDataAddAccount(dONS);
	}

	// Change user session
	setCurrentUser(data) {
		if (this.sessionData.current.id !== data.id) {
			const dSCU = {
				type: 'set',
				data: data
			};

			this.sessionService.setDataAddAccount(dSCU);
		}
	}

	// Close session
	closeSession(data) {
		const dCS = {
			type: 'close',
			data: data
		};

		this.sessionService.setDataAddAccount(dCS);

		// Remove session
		for (const i in this.sessionData.sessions) {
			if (this.sessionData.sessions[i].id === data.id) {
				this.sessionData.sessions.splice(i, 1);
			}
		}

		// Set session after remove
		if (this.sessionData.sessions[0].id !== data.id) {
			this.sessionData.current = this.sessionData.sessions[0];
		}
	}
}
