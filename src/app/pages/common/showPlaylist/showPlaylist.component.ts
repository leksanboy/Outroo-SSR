import { Component, OnInit, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

import { ActiveSessionComponent } from '../../../../app/pages/common/activeSession/activeSession.component';
import { NewPlaylistComponent } from '../../../../app/pages/common/newPlaylist/newPlaylist.component';

declare var global: any;

@Component({
	selector: 'app-show-playlist',
	templateUrl: './showPlaylist.component.html'
})
export class ShowPlaylistComponent implements OnInit {
	@ViewChild('dialogBox') dialogBox: ElementRef;

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
		private router: Router,
		public dialog: MatDialog,
		private location: Location,
		private alertService: AlertService,
		private playerService: PlayerService,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private renderer: Renderer2
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
					this.data.info.backdrop = data.colors ? ('linear-gradient(45deg, rgb(' + data.colors[0] + ') 0%,  rgba(0, 0, 0, 0) 70%), linear-gradient(135deg, rgb(' + data.colors[1] + ') 10%, rgba(0, 0, 0, 0) 80%), linear-gradient(225deg, rgb(' + data.colors[2] + ') 10%, rgba(0, 0, 0, 0) 80%), linear-gradient(315deg, rgb(' + data.colors[3] + ') 100%, rgba(0,0,0, 0) 70%)') : null;
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
					let aa = this.audioDataService.getCoverColor('playlist', this.env.pathAudios + 'covers/' + res.info.image);
					console.log('aa:', aa)

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
			this.audioPlayerData.location = 'showPlaylist';
			this.audioPlayerData.type = type;
			this.audioPlayerData.selectedIndex = this.data.selectedIndex;
			this.audioPlayerData.postId = this.data.info.id;
			/* this.audioPlayerData.playlist = this.data.info.id; */

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
			case 'whatsapp':
				const urlWhatsapp = 'https://api.whatsapp.com/send?text=' + this.env.url + 'p/' + item.name;
				this.window.open(urlWhatsapp, '_blank');
				break;
			case 'twitter':
				const urlTwitter = 'https://twitter.com/intent/tweet?text=' + this.env.url + 'p/' + item.name;
				this.window.open(urlTwitter, '_blank');
				break;
			case 'facebook':
				const urlFacebook = 'https://www.facebook.com/sharer/sharer.php?u=' + this.env.url + this.sessionData.current.usurname + '&title=' + this.env.url + 'p/' + item.name;
				this.window.open(urlFacebook, '_blank');
				break;
			case 'messenger':
				const urlMessenger = 'https://www.facebook.com/dialog/send?link=' + this.env.url + 'p/' + item.name + '&app_id=844385062569000&redirect_uri=' + this.env.url + 'p/' + item.name;
				this.window.open(urlMessenger, '_blank');
				break;
			case 'telegram':
				const urlTelegram = 'https://t.me/share/url?url=' + this.env.url + 'p/' + item.name;
				this.window.open(urlTelegram, '_blank');
				break;
			case 'reddit':
				const urlReddit = 'https://www.reddit.com/submit?title=Share%20this%20post&url=' + this.env.url + 'p/' + item.name;
				this.window.open(urlReddit, '_blank');
				break;
		}
	}

	// Playlist options
	itemPlaylistOptions(type, item, index) {
		switch (type) {
			case 'show':
				this.location.go('/pl/' + item.name);

				const configShow = {
					disableClose: false,
					data: {
						sessionData: this.sessionData,
						userData: this.sessionData.current,
						translations: this.translations,
						item: item,
						audioPlayerData: this.audioPlayerData
					}
				};

				const dialogRefShow = this.dialog.open(ShowPlaylistComponent, configShow);
				dialogRefShow.beforeClosed().subscribe((res: string) => {
					// Set url
					this.location.go(this.router.url);
				});
				break;
			case 'edit':
				this.location.go('/' + this.sessionData.current.username + '/songs#editPlaylist');
				item.path = this.env.pathAudios;
				item.index = index;

				const configEdit = {
					disableClose: false,
					data: {
						type: 'edit',
						sessionData: this.sessionData,
						translations: this.translations,
						item: item
					}
				};

				const dialogRefEdit = this.dialog.open(NewPlaylistComponent, configEdit);
				dialogRefEdit.afterClosed().subscribe((res: any) => {
					this.location.go(this.router.url);

					if (res) {
						const data = {
							index: res.index,
							item: res
						};

						this.updatePlaylist('edit', data);
					}
				});
				break;
			case 'publicPrivate':
				item.private = !item.private;
				item.privateType = item.private ? 'private' : 'public';

				const dataPPS = {
					type: item.privateType,
					id: item.id
				};

				this.audioDataService.publicPrivate(dataPPS).subscribe();
				break;
			case 'addRemoveSession':
				item.addRemoveSession = !item.addRemoveSession;
				item.removeType = !item.addRemoveSession ? 'add' : 'remove';
				item.removed = item.addRemoveSession ? true : false;

				const dataARS = {
					type: item.removeType,
					location: 'session',
					id: item.idPlaylist
				};

				this.audioDataService.addRemovePlaylist(dataARS)
					.subscribe((res: any) => {
						this.updatePlaylist('addRemoveSession', null);
					});
				break;
			case 'addRemoveUser':
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
						this.updatePlaylist('addRemoveUser', item);

						this.alertService.success(this.translations.common.clonedPlaylistSuccessfully);
					});
				break;
			case 'follow':
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
			case 'report':
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
			case 'whatsapp':
				const urlWhatsapp = 'https://api.whatsapp.com/send?text=' + this.env.url + 'p/' + item.name;
				this.window.open(urlWhatsapp, '_blank');
				break;
			case 'twitter':
				const urlTwitter = 'https://twitter.com/intent/tweet?text=' + this.env.url + 'p/' + item.name;
				this.window.open(urlTwitter, '_blank');
				break;
			case 'facebook':
				const urlFacebook = 'https://www.facebook.com/sharer/sharer.php?u=' + this.env.url + this.sessionData.current.usurname + '&title=' + this.env.url + 'p/' + item.name;
				this.window.open(urlFacebook, '_blank');
				break;
			case 'messenger':
				const urlMessenger = 'https://www.facebook.com/dialog/send?link=' + this.env.url + 'p/' + item.name + '&app_id=844385062569000&redirect_uri=' + this.env.url + 'p/' + item.name;
				this.window.open(urlMessenger, '_blank');
				break;
			case 'telegram':
				const urlTelegram = 'https://t.me/share/url?url=' + this.env.url + 'p/' + item.name;
				this.window.open(urlTelegram, '_blank');
				break;
			case 'reddit':
				const urlReddit = 'https://www.reddit.com/submit?title=Share%20this%20post&url=' + this.env.url + 'p/' + item.name;
				this.window.open(urlReddit, '_blank');
				break;
		}
	}

	// Update playlist
	updatePlaylist(type, data) {
		if (type === 'create') {
			const d = {
				type: 'create',
				item: null
			};
			this.sessionService.setDataCreatePlaylist(d);
		} else if (type === 'edit') {
			let newPl = [];

			for (let p of this.sessionData.current.playlists) {
				if (p.id == data.item.id) {
					newPl.push(data.item);
				} else {
					newPl.push(p);
				}
			}

			this.sessionData.current.playlists = newPl;
			this.sessionData.current.playlists = this.sessionData.current.playlists;
		} else if (type === 'addRemoveSession') {
			this.sessionData.current.playlists = this.sessionData.current.playlists;
		} else if (type === 'addRemoveUser') {
			if (data.type === 'add') {
				this.sessionData.current.playlists.unshift(data);
			} else {
				for (const i in this.sessionData.current.playlists) {
					if (i) {
						if (this.sessionData.current.playlists[i].id = data.id) {
							this.sessionData.current.playlists[i] = data;
						}
					}
				}
			}
		}

		// Update playslists on selects
		this.sessionData = this.userDataService.setSessionData('update', this.sessionData.current);
		this.sessionService.setDataPlaylists(this.sessionData);
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

	// Close
	close() {
		this.dialogRef.close();
	}
}
