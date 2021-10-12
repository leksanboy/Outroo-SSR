import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

import { environment } from '../../../../environments/environment';

declare var global: any;

@Component({
	selector: 'app-active-player-mobile',
	templateUrl: './activePlayerMobile.component.html'
})
export class ActivePlayerMobileComponent implements OnInit, OnDestroy, AfterViewInit {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public noData: boolean;
	public audio: any;
	public showPlayer: boolean;
	public showPlayerAnimation: boolean;
	public rippleColor = 'rgba(255, 255, 255, .15)';
	public activeDetectChanges = true;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private bottomSheetRef: MatBottomSheetRef<ActivePlayerMobileComponent>,
		private alertService: AlertService,
		private audioDataService: AudioDataService,
		private playerService: PlayerService,
		private sessionService: SessionService,
		private ref: ChangeDetectorRef,
		private router: Router,
	) {
		this.sessionData = this.data.sessionData;
		this.audioPlayerData = this.data.playerData;
		this.audioPlayerData.current.item = this.data.playerData.item;
		this.translations = this.data.translations;
		this.audio = this.data.audio;
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeDetectChanges = false;
	}

	ngAfterViewInit() {
		const self = this;

		// Auto progress bar
		this.audio.addEventListener('timeupdate', function () {
			const countDown = Math.round(self.audio.duration - self.audio.currentTime);
			self.audioPlayerData.current.time = self.formatTime(self.audio.currentTime);

			// Detect changes when song is playing
			self.detectChanges();

			// Countdown time
			const durationCountDown = self.formatTime(countDown);
			self.audioPlayerData.current.duration = parseInt(durationCountDown.split(':')[1], 10) === 0 ? self.audioPlayerData.list[self.audioPlayerData.current.key].duration : durationCountDown;
			self.audioPlayerData.list[self.audioPlayerData.current.key].countdown = parseInt(durationCountDown.split(':')[1], 10) === 0 ? self.audioPlayerData.list[self.audioPlayerData.current.key].duration : durationCountDown;

			// Progress bar
			const progress = ((self.audio.currentTime / self.audio.duration) * 1000);
			self.audioPlayerData.current.progress = progress;
		});
	}

	// Refresh data on sheet / progresbar ant duration
	detectChanges() {
		if (this.activeDetectChanges) {
			this.ref.detectChanges();
		}
	}

	// repeat · next · play/pause · prev · shuffle
	playSong(type, key) {
		switch (type) {
			case ('item'):
				this.audioPlayerData.key = key;
				this.audioPlayerData.buttonType = 'item';
				this.playerService.setPlayTrack(this.audioPlayerData);
				break;
			case ('play'):
				this.playSong('item', this.audioPlayerData.key);
				break;
			case ('prev'):
				this.audioPlayerData.key = key;
				this.audioPlayerData.buttonType = 'prev';
				this.playerService.setPlayTrack(this.audioPlayerData);
				break;
			case ('next'):
				this.audioPlayerData.key = key;
				this.audioPlayerData.buttonType = 'next';
				this.playerService.setPlayTrack(this.audioPlayerData);
				break;
			case ('shuffle'):
				this.audioPlayerData.shuffle = !this.audioPlayerData.shuffle;
				this.playerService.setCurrentTrack(this.audioPlayerData);
				break;
			case ('repeat'):
				this.audioPlayerData.repeat = !this.audioPlayerData.repeat;
				this.playerService.setCurrentTrack(this.audioPlayerData);
				break;
			case ('thumbnail'):
				this.audioPlayerData.activeThumbnail = !this.audioPlayerData.activeThumbnail
				break;
			case ('explore'):
				this.close();
				this.router.navigate([this.sessionData.current.username + '/songs']);
				break;
			case ('supermode'):
				this.audioPlayerData.superModeCount = !this.audioPlayerData.superModeCount ? 1 : this.audioPlayerData.superModeCount+1;

				if (this.audioPlayerData.superModeCount >= 13) {
					this.alertService.success('Super mode activated');
					this.audioPlayerData.superModeCount = 1;
				}
				break;
		}
	}

	// Time format
	formatTime(time) {
		const duration = time,
			hours = Math.floor(duration / 3600),
			minutes = Math.floor((duration % 3600) / 60),
			seconds = Math.floor(duration % 60),
			result = [];

		if (hours) {
			result.push(hours);
		}

		result.push(((hours ? '0' : '') + (minutes ? minutes : 0)).substr(-2));
		result.push(('0' + (seconds ? seconds : 0)).substr(-2));

		return result.join(':');
	}

	// Item options: add/remove, share, search, report
	itemSongOptions(type, item, playlist) {
		switch (type) {
			case ('addRemoveSession'):
				item.addRemoveSession = !item.addRemoveSession;
				item.type = item.addRemoveSession ? 'remove' : 'add';

				const dataS = {
					type: item.type,
					location: 'session',
					id: item.id
				};

				this.audioDataService.addRemove(dataS)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
						text = !item.addRemoveSession ? (' ' + this.translations.common.hasBeenAdded) : (' ' + this.translations.common.hasBeenRemoved);
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case ('addRemoveUser'):
				item.addRemoveUser = !item.addRemoveUser;
				item.type = item.addRemoveUser ? 'add' : 'remove';

				const dataU = {
					type: item.type,
					location: 'user',
					id: item.insertedId,
					item: item.song
				};

				this.audioDataService.addRemove(dataU)
					.subscribe(res => {
						item.insertedId = res;

						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
						text = item.addRemoveUser ? (' ' + this.translations.common.hasBeenAdded) : (' ' + this.translations.common.hasBeenRemoved);
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case ('playlist'):
				item.type = !item.addRemoveUser ? 'add' : 'remove';

				const dataP = {
					type: item.type,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				};

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						const song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title;
						this.alertService.success(song + ' has been added to ' + playlist.title);
					}, error => {
						this.alertService.success('An error has ocurred');
					});
				break;
			case ('createPlaylist'):
				const dataCP = {
					type: 'create',
					item: item
				};

				this.sessionService.setDataCreatePlaylist(dataCP);
				break;
			case ('report'):
				item.type = 'audio';
				this.sessionService.setDataReport(item);
				break;
			case 'message':
				item.comeFrom = 'shareSong';
				this.sessionService.setDataNewShare(item);
				break;
			case 'newTab':
				const url = this.env.url + 's/' + item.name.slice(0, -4);
				this.window.open(url, '_blank');
				break;
			case 'copyLink':
				const urlExtension = this.env.url + 's/' + item.name.slice(0, -4);
				this.sessionService.setDataCopy(urlExtension);
				break;
			case 'whatsapp':
				const urlWhatsapp = 'https://api.whatsapp.com/send?text=' + this.env.url + 's/' + item.name;
				this.window.open(urlWhatsapp, '_blank');
				break;
			case 'twitter':
				const urlTwitter = 'https://twitter.com/intent/tweet?text=' + this.env.url + 's/' + item.name;
				this.window.open(urlTwitter, '_blank');
				break;
			case 'facebook':
				const urlFacebook = 'https://www.facebook.com/sharer/sharer.php?u=' + this.env.url + this.sessionData.current.usurname + '&title=' + this.env.url + 's/' + item.name;
				this.window.open(urlFacebook, '_blank');
				break;
			case 'messenger':
				const urlMessenger = 'https://www.facebook.com/dialog/send?link=' + this.env.url + 's/' + item.name + '&app_id=844385062569000&redirect_uri=' + this.env.url + 'p/' + item.name;
				this.window.open(urlMessenger, '_blank');
				break;
			case 'telegram':
				const urlTelegram = 'https://t.me/share/url?url=' + this.env.url + 's/' + item.name;
				this.window.open(urlTelegram, '_blank');
				break;
			case 'reddit':
				const urlReddit = 'https://www.reddit.com/submit?title=Share%20this%20post&url=' + this.env.url + 's/' + item.name;
				this.window.open(urlReddit, '_blank');
				break;
		}
	}

	// Progress bar
	progressBar(event) {
		const time = ((event.value / 1000) * this.audio.duration);
		this.audio.currentTime = time;
	}

	// Close sheet
	close() {
		this.bottomSheetRef.dismiss();
	}
}
