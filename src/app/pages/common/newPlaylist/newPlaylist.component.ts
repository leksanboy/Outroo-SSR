import { Location, DOCUMENT } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

import { NewAvatarComponent } from '../../../../app/pages/common/newAvatar/newAvatar.component';

@Component({
	selector: 'app-new-playlist',
	templateUrl: './newPlaylist.component.html'
})
export class NewPlaylistComponent implements OnInit {
	@ViewChild('imageSrc') inputImage: ElementRef;

	public sessionData: any = [];
	public translations: any = [];
	public env: any = environment;
	public cropperData: any;
	public flipHrz: boolean;
	public flipVrt: boolean;
	public submitLoading: boolean;
	public actionForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		@Inject(DOCUMENT) private document: Document,
		public dialogRef: MatDialogRef<NewPlaylistComponent>,
		private sanitizer: DomSanitizer,
		private _fb: FormBuilder,
		public dialog: MatDialog,
		private location: Location,
		private alertService: AlertService,
		private playerService: PlayerService,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService
	) {
		this.sessionData = data.sessionData;
		this.translations = data.translations;
		this.data.current = data.item ? data.item : null;

		if (this.data.type === 'edit') {
			this.actionForm = this._fb.group({
				title: [this.data.current.title, [Validators.required]],
				advanced: [(this.data.current.genre || this.data.current.description)],
				genre: [this.data.current.genre],
				description: [this.data.current.description],
				explicit: [this.data.current.explicit]
			});
			this.data.showAdvanced = (this.data.current.genre || this.data.current.description);
		} else if (this.data.type === 'create') {
			this.actionForm = this._fb.group({
				title: ['', [Validators.required]],
				advanced: [''],
				genre: [''],
				description: [''],
				explicit: ['']
			});
		}

		// Get cover data
		this.playerService.getCoverTrack()
			.subscribe(data => {
				if (data.type === 'playlist') {
					this.data.color = data.color ? ('rgba(' + data.color + ', 1)') : null;
				}
			});
	}

	ngOnInit() {
		// Advanced
		this.actionForm.controls['advanced'].valueChanges
			.pipe(distinctUntilChanged())
			.subscribe(val => {
				this.data.showAdvanced = val;
			});

		// Get genres
		const data = {
			user: this.sessionData.current.id,
			type: 'genres',
			rows: 0,
			cuantity: 100
		};

		this.audioDataService.general(data)
			.subscribe((res: any) => {
				this.data.genres = res;
			});
}

	// Change image
	openImage(action, event) {
		if (action === 'upload') {
			let file = event.target.files[0];

			if (/^image\/\w+$/.test(file.type)) {
				file = URL.createObjectURL(file);
				let image = this.sanitizer.bypassSecurityTrustUrl(file);

				const config = {
					disableClose: false,
					data: {
						sessionData: this.sessionData,
						translations: this.translations,
						image: image,
						comeFrom: 'playlist'
					}
				};

				const dialogRef = this.dialog.open(NewAvatarComponent, config);
				dialogRef.afterClosed().subscribe(res => {
					this.data.newImage = res;
					console.log('ni:', this.data.newImage);

					// Replace current image
					if (this.data.current) {
						this.data.current.image = this.data.newImage;
						(this.data.newImage ? this.audioDataService.getCoverColor('playlist', this.data.newImage) : null);
					}
				});
			} else {
				this.alertService.error(this.translations.common.invalidFile);
			}
		} else if (action === 'remove') {
			this.data.newImage = '';
		}
	}

	submit() {
		const form = this.actionForm.value;

		switch (this.data.type) {
			case 'create':
				if (form.title.trim().length > 0) {
					this.submitLoading = true;

					let data = {
						type: 'create',
						title: form.title,
						image: this.data.newImage,
						color: this.data.color,
						genre: form.advanced ? (form.genre ? form.genre : null) : null,
						description: form.advanced ? (form.description.trim() ? form.description : null) : null,
						explicit: form.advanced ? (form.explicit ? form.explicit : null) : null
					};

					this.audioDataService.createPlaylist(data)
						.subscribe((res: any) => {
							this.submitLoading = false;
							this.dialogRef.close(res);
						});
				} else {
					this.alertService.error(this.translations.common.completeAllFields);
				}
				break;
			case 'edit':
				if (form.title.trim().length > 0) {
					this.submitLoading = true;

					let data = {
						type: 'update',
						id: this.data.current.id,
						title: form.title,
						image: this.data.newImage ? this.data.newImage : null,
						color: this.data.color,
						genre: form.advanced ? (form.genre ? form.genre : null) : null,
						description: form.advanced ? (form.description.trim() ? form.description : null) : null,
						explicit: form.advanced ? (form.explicit ? form.explicit : null) : null
					};

					this.audioDataService.createPlaylist(data)
						.subscribe((res: any) => {
							this.submitLoading = false;
							this.dialogRef.close(res);
						});
				} else {
					this.alertService.error(this.translations.common.completeAllFields);
				}
				break;
		}
	}

	close() {
		this.dialogRef.close();
	}
}
