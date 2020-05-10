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
import { RoutingStateService } from '../../../../app/core/services/route/state.service';

import { NewAvatarComponent } from '../../../../app/pages/common/newAvatar/newAvatar.component';

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
	public submitPersonalLoading: boolean;
	public submitPasswordLoading: boolean;
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
		private userDataService: UserDataService,
		private routingStateService: RoutingStateService
	) {
		// Session
		this.sessionData = this.activatedRoute.snapshot.data.sessionResolvedData;

		// Translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;

		// Data
		if (this.sessionData) {
			// Set Google analytics
			const url = 'settings';
			const title = this.translations.settings.title;
			const userId = this.sessionData.current.id;
			this.userDataService.analytics(url, title, userId);

			// Set title
			this.titleService.setTitle(title);

			// Set froms
			this.setForms(this.sessionData.current);
		} else {
			this.userDataService.noSessionData();
		}

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				this.getTranslations(data);
			});
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeLanguage.unsubscribe();
	}

	// Go back
	goBack() {
		this.routingStateService.getPreviousUrl();
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
	setForms(data) {
		/* ******
		Edit data
		****** */

		this.validatorUsername = null;

		// Personal data form
		this.actionFormPersonalData = this._fb.group({
			theme: [data.theme],
			username: [data.username, [Validators.required]],
			name: [data.name, [Validators.required]],
			language: [data.language, [Validators.required]],
			about: [data.about]
		});

		// Theme
		this.actionFormPersonalData.get('theme').valueChanges
			.subscribe(val => {
				if (val === 0) {
					this.document.body.classList.remove('darkTheme');
				} else if (val === 1) {
					this.document.body.classList.add('darkTheme');
				}

				this.alertService.success(this.translations.common.themeEnabled);

				const data = {
					theme: val
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

		// Validate username
		this.actionFormPersonalData.get('username').valueChanges
			.subscribe(val => {
				this.actionFormPersonalData.controls['username'].setErrors({ validate: false });
			});

		this.actionFormPersonalData.get('username').valueChanges
			.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(val => {
				this.validatorUsername = 'load';
				const regex = /^[a-zA-Z0-9._-]+$/;

				if (val !== '' && regex.test(val)) {
					this.userDataService.checkUsername(val)
						.subscribe(
							res => {
								setTimeout(() => {
									if (res) {
										if (val === data.username) {
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

		/* *****
		Password
		***** */

		this.validatorNewPassword = null;
		this.validatorOldPassword = null;

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

	// Change avatar
	openImage(action, event) {
		if (action === 'upload') {
			let file = event.target.files[0];

			if (/^image\/\w+$/.test(file.type)) {
				file = URL.createObjectURL(file);
				let image = this.sanitizer.bypassSecurityTrustUrl(file);
				this.location.go('/settings#avatar');

				const config = {
					disableClose: false,
					data: {
						sessionData: this.sessionData,
						translations: this.translations,
						image: image,
						comeFrom: 'avatar'
					}
				};

				const dialogRef = this.dialog.open(NewAvatarComponent, config);
				dialogRef.afterClosed().subscribe((res: string) => {
					this.location.go(this.router.url);

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
	}

	// Save data
	submit(type) {
		if (type === 'personal') {
			const form = this.actionFormPersonalData.value;
			const regex = /^[a-zA-Z0-9._-]+$/;
			const params = {
				username: form.username,
				name: form.name.trim(),
				language: form.language,
				about: form.about
			};

			if (params.username.trim().length === 0 || !regex.test(params.username)) {
				this.alertService.error(this.translations.settings.usernameRequirements);
			} else {
				this.submitPersonalLoading = true;

				this.userDataService.updateData(params)
					.subscribe(res => {
						setTimeout(() => {
							this.submitPersonalLoading = false;
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
						this.submitPersonalLoading = false;
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
			}
		} else if (type === 'password') {
			const form = this.actionFormPasswordData.value;

			if (form.oldPassword.trim().length > 0 &&
				form.newPassword.trim().length > 0 &&
				form.confirmPassword.trim().length > 0
			) {
				if (form.newPassword.trim() !== form.confirmPassword.trim()) {
					this.alertService.error(this.translations.settings.passwordsNotMatch);
				} else {
					this.submitPasswordLoading = false;

					const data = {
						oldPassword: form.oldPassword,
						newPassword: form.newPassword
					};

					this.userDataService.updatePassword(data)
						.subscribe(res => {
							setTimeout(() => {
								this.validatorOldPassword = 'done';
								this.submitPasswordLoading = false;
								this.alertService.success(this.translations.common.savedSuccessfully);
							}, 1000);
						}, error => {
							this.validatorOldPassword = 'bad';
							this.submitPasswordLoading = false;
							this.alertService.error(this.translations.settings.oldPasswordIncorrect);
						});
				}
			} else {
				this.alertService.error(this.translations.common.completeAllFields);
			}
		} else if (type === 'privacy') {
			const data = {
				private: this.sessionData.current.private ? 0 : 1
			};

			this.userDataService.updatePrivate(data)
				.subscribe(res => {
					this.sessionData = this.userDataService.getSessionData();
					this.sessionService.setData(this.sessionData);

					if (data.private === 1) {
						this.alertService.success(this.translations.common.privateEnabled);
					} else {
						this.alertService.success(this.translations.common.privateDisabled);
					}
				}, error => {
					this.alertService.error(this.translations.common.anErrorHasOcurred);
				});
		}
	}

	// Add more sessions
	openNewSession() {
		const dONS = {
			type: 'create',
			data: {
				sessionData: this.sessionData,
				translations: this.translations
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
