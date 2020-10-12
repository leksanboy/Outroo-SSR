import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Location, DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

import { ActiveSessionComponent } from '../../../../app/pages/common/activeSession/activeSession.component';

declare var global: any;

@Component({
	selector: 'app-show-playlist',
	templateUrl: './showPlaylist.component.html'
})
export class ShowPlaylistComponent implements OnInit {
	public env: any = environment;
	public window: any = global;
	public sessionData: any = [];
	public userData: any = [];
	public audioPlayerData: any = [];
	public translations: any = [];
	public recommendedPlaylists = {
		loading: false,
		noData: true,
		show: false,
		list: []
	};
	public activeSessionComponent: ActiveSessionComponent;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		@Inject(DOCUMENT) private document: Document,
		public dialogRef: MatDialogRef<ShowPlaylistComponent>,
		public dialog: MatDialog,
		private router: Router,
		private location: Location,
		private alertService: AlertService,
		private playerService: PlayerService,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService
	) {
		this.sessionData = data.sessionData;
		this.userData = data.userData;
		this.translations = data.translations;
		this.data.info = [];
		this.data.list = [];
		this.data.current = data.item;
		this.data.loadingData = true;
		this.data.noData = false;

		// Get cover data
		this.playerService.getCoverTrack()
			.subscribe(data => {
				if (data.type === 'playlist') {
					this.data.info.shadow = data.color ? ('0 20px 50px rgba(' + data.color + ', 0.42)') : null;
				}
			});
	}

	ngOnInit() {
		this.window.scrollTo(0, 0);

		const params = {
			id: this.data.current.o_id ? this.data.current.o_id : this.data.current.id
		};

		this.audioDataService.getPlaylist(params)
			.subscribe((res: any) => {
				this.data.loadingData = false;

				if (!res || res.length === 0 || res.info.length === 0) {
					this.data.noData = true;
				} else {
					this.data.info = res.info;
					this.data.list = res.list;
					(res.info.image ? this.audioDataService.getCoverColor('playlist', this.env.pathAudios + 'covers/' + res.info.image) : null);

					if (res.list.length === 0) {
						this.data.noData = true;
					}
				}
			});

		// Get player data
		this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});

		// Get recommended playlists
		this.getRecommendedPlaylists();
	}

	// Play item song
	playSong(data, item, key, type) {
		if (this.audioPlayerData.key === key &&
			this.audioPlayerData.type === type &&
			this.audioPlayerData.item.song === item.song
		) { // Play/Pause current
			item.playing = !item.playing;
			this.data.playing = !this.data.playing;
			this.playerService.setPlayTrack(this.audioPlayerData);
		} else { // Play new one
			this.audioPlayerData.list = data;
			this.audioPlayerData.item = item;
			this.audioPlayerData.key = key;
			/* this.audioPlayerData.user = this.userData.id;
			this.audioPlayerData.username = this.userData.username; */
			this.audioPlayerData.location = 'playlist';
			this.audioPlayerData.type = type;
			this.audioPlayerData.selectedIndex = this.data.selectedIndex;
			this.audioPlayerData.playlist = this.data.info.id;

			item.playing = true;
			this.data.playing = true;
			this.playerService.setData(this.audioPlayerData);
		}
	}

	// Play/Pause
	playTrack(type) {
		if (this.data.list.length > 0) {
			if (type === 'play') {
				this.playSong(this.data.list,
					(this.audioPlayerData.item ? this.audioPlayerData.item : this.data.list[0]),
					(this.audioPlayerData.key ? this.audioPlayerData.key : 0),
					'default');
			} else if (type === 'prev') {
				const prevKey = (this.audioPlayerData.key === 0) ? (this.data.list.length - 1) : (this.audioPlayerData.key - 1);
				this.audioPlayerData.key = prevKey;
				this.playerService.setData(this.audioPlayerData);
			} else if (type === 'next') {
				const nextKey = (this.audioPlayerData.key === this.data.list.length - 1) ? 0 : (this.audioPlayerData.key + 1);
				this.audioPlayerData.key = nextKey;
				this.playerService.setData(this.audioPlayerData);
			}
		} else {
			this.alertService.warning(this.translations.common.addSomeSongsToPlaylist);
		}
	}

	// Item options
	itemSongOptions(type, item, playlist) {
		switch (type) {
			case ('addRemoveSession'):
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = item.addRemoveSession ? 'remove' : 'add';

				const dataARS = {
					type: item.removeType,
					subtype: 'session',
					location: 'playlist',
					id: item.id
				};

				this.audioDataService.addRemove(dataARS)
					.subscribe(res => {
						const song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = !item.addRemoveSession ? (' ' + this.translations.hasBeenAdded) : (' ' + this.translations.hasBeenRemoved);

						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case ('addRemoveUser'):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				const dataARO = {
					type: item.removeType,
					location: 'user',
					id: item.insertedId,
					item: item.song
				};

				this.audioDataService.addRemove(dataARO)
					.subscribe(res => {
						const song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = item.addRemoveUser ? (' ' + this.translations.hasBeenAdded) : (' ' + this.translations.hasBeenRemoved);

						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
					});
				break;
			case ('playlist'):
				item.removeType = !item.addRemoveUser ? 'add' : 'remove';

				const dataP = {
					type: item.removeType,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				};

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						const song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = ' ' + this.translations.hasBeenAddedTo + playlist.title;

						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.common.anErrorHasOcurred);
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
				item.type = 'playlist';
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
		}
	}

	// Recommended playlists
	getRecommendedPlaylists() {
		this.recommendedPlaylists.show = !this.recommendedPlaylists.show;
		this.recommendedPlaylists.loading = true;

		if (this.recommendedPlaylists.show && this.recommendedPlaylists.list.length === 0) {
			const data = {
				user: this.userData.id
			};

			this.audioDataService.getRecommendedPlaylists(data)
				.subscribe((res: any) => {
					this.recommendedPlaylists.loading = false;

					if (!res || res.length === 0) {
						this.recommendedPlaylists.noData = true;
					} else {
						this.recommendedPlaylists.noData = false;
						this.recommendedPlaylists.list = res;
					}
				}, error => {
					this.recommendedPlaylists.loading = false;
				});
		} else {
			this.recommendedPlaylists.loading = false;
		}
	}

	// Playlist options
	itemPlaylistOptions(type, item, index) {
		switch (type) {
			case ('show'):
				this.location.go('/pl/' + item.name);

				const configShow = {
					disableClose: false,
					backdropClass: 'cdk-overlay-transparent-backdrop',
					data: {
						sessionData: this.sessionData,
						userData: this.userData,
						translations: this.translations,
						item: item,
						audioPlayerData: this.audioPlayerData
					}
				};

				const dialogRefShow = this.dialog.open(ShowPlaylistComponent, configShow);
				dialogRefShow.beforeClosed().subscribe((res: any) => {
					this.location.go('/pl/' + this.data.current.name);
				});
				break;
			case ('addRemoveUser'):
				item.addRemoveUser = !item.addRemoveUser;
				item.removeType = item.addRemoveUser ? 'add' : 'remove';

				const dataARO = {
					type: item.removeType,
					location: 'user',
					id: item.id,
					title: item.title,
					image: item.image,
					playlist: item.idPlaylist,
					insertedPlaylist: item.insertedPlaylist
				};

				this.audioDataService.addRemovePlaylist(dataARO)
					.subscribe((res: any) => {
						item.idPlaylist = res;
						item.insertedPlaylist = item.insertedPlaylist ? item.insertedPlaylist : res;

						if (dataARO.type === 'add') {
							this.sessionData.current.playlists.unshift(dataARO);
						} else {
							for (const i in this.sessionData.current.playlists) {
								if (i) {
									if (this.sessionData.current.playlists[i].id = dataARO.id) {
										this.sessionData.current.playlists[i] = dataARO;
									}
								}
							}
						}
						// Update playslists on selects
						this.sessionData = this.userDataService.setSessionData('update', this.sessionData.current);
						this.sessionService.setDataPlaylists(this.sessionData);

						this.alertService.success(this.translations.common.clonedPlaylistSuccessfully);
					});
				break;
			case ('follow'):
				item.followUnfollow = !item.followUnfollow;
				item.removeType = item.followUnfollow ? 'add' : 'remove';

				const dataF = {
					type: item.removeType,
					location: 'user',
					id: item.id,
					title: item.title,
					image: item.image,
					playlist: item.idPlaylist,
					insertedPlaylist: item.insertedPlaylist
				};

				this.audioDataService.followPlaylist(dataF)
					.subscribe((res: any) => {
						this.alertService.success(this.translations.common.followingPlaylistSuccessfully);
					});

				break;
			case ('report'):
				item.type = 'audioPlaylist';
				this.sessionService.setDataReport(item);
				break;
			case 'message':
				item.comeFrom = 'sharePlaylist';
				this.sessionService.setDataNewShare(item);
				break;
			case 'newTab':
				const url = this.env.url + 'pl/' + item.name;
				this.window.open(url, '_blank');
				break;
			case 'copyLink':
				const urlExtension = this.env.url + 'pl/' + item.name;
				this.sessionService.setDataCopy(urlExtension);
				break;
		}
	}

	// Close
	close() {
		this.dialogRef.close();
	}
}
