/* import { Component, Input } from '@angular/core';

@Component({
    selector: 'song-template',
    template: `
    <li *ngFor="let x of dataGeneral?.list?.hits; let i=index;" [ngClass]="{active: audioPlayerData.key === i && audioPlayerData.location === 'audios' && audioPlayerData.type === 'hits', remove: x.addRemoveSession, advert: x.contentTypeAd}">
        <div mat-ripple class="inner" *ngIf="!x.contentTypeAd">
            <div class="image">
                <button mat-icon-button (click)="playSong(dataGeneral?.list?.hits, x, i, 'hits')">
                    <i label="play" *ngIf="!x.playing || !(audioPlayerData.location === 'audios' && audioPlayerData.type === 'hits')"></i>
                    <i label="pause" *ngIf="x.playing && (audioPlayerData.location === 'audios' && audioPlayerData.type === 'hits')"></i>
                    <img [src]="x.image ? (env.pathAudios + 'thumbnails/' + x.image) : env.defaultSongCover"/>
                </button>
            </div>

            <div class="text" (click)="playSong(dataGeneral?.list?.hits, x, i, 'hits')">
                <div class="titleArtist" title="{{x.original_title ? x.original_title : x.title}}">
                    <div class="title">{{x.original_title ? x.original_title : x.title}}</div>
                    <div class="artist">{{x.original_artist ? x.original_artist : x.title}}</div>
                </div>
                <div class="explicitDuration">
                    <i label="explicit" class="icon65 grey" matTooltip="{{translations?.common?.explicit}}" *ngIf="x.explicit"></i>
                    <div class="duration">{{x.duration}}</div>
                </div>
            </div>

            <div class="actions" *ngIf="sessionData?.current?.id">
                <span *ngIf="userData?.id === sessionData?.current?.id">
                    <button mat-icon-button [matMenuTriggerFor]="appMenu">
                        <i class="icon85 grey" label="more"></i>
                    </button>
                </span>

                <span *ngIf="userData?.id !== sessionData?.current?.id">
                    <button mat-icon-button [matMenuTriggerFor]="appMenu">
                        <i class="icon85 blue" label="check" *ngIf="x.addRemoveUser"></i>
                        <i class="icon85 grey" label="more" *ngIf="!x.addRemoveUser"></i>
                    </button>
                </span>

                <mat-menu #appMenu="matMenu">
                    <button mat-menu-item (click)="itemSongOptions('addRemoveUser', x, null)">{{!x.addRemoveUser ? translations?.common?.add : translations?.common?.remove}}</button>
                    <button mat-menu-item [matMenuTriggerFor]="menuPlaylists" #trigger="matMenuTrigger">{{translations?.common?.addToPlaylist}}</button>
                    <button mat-menu-item [matMenuTriggerFor]="menuShareSocial" #trigger="matMenuTrigger">{{translations?.common?.share}}</button>
                    <button mat-menu-item (click)="itemSongOptions('report', x, null)">{{translations?.common?.report}}</button>
                    <mat-divider *ngIf="userData?.id === sessionData?.current?.id"></mat-divider>
                    <button mat-menu-item (click)="itemSongOptions('addRemoveSession', x, null)" *ngIf="userData?.id === sessionData?.current?.id">{{x.addRemoveSession ? translations?.common?.restore : translations?.common?.remove}}</button>
                </mat-menu>

                <mat-menu #menuPlaylists="matMenu">
                    <button mat-menu-item (click)="itemSongOptions('createPlaylist', x, null)">{{translations?.common?.createPlaylist}}</button>
                    <mat-divider *ngIf="sessionData?.current?.playlists?.length > 0"></mat-divider>
                    <span *ngFor="let p of sessionData?.current?.playlists">
                        <button mat-menu-item *ngIf="!p.removed" (click)="itemSongOptions('playlist', x, p)">
                            <img [src]="p.image ? (env.pathAudios + 'covers/' + p.image) : env.defaultPlaylistCover">
                            {{p.title}}
                        </button>
                    </span>
                </mat-menu>

                <mat-menu #menuShareSocial="matMenu">
                    <button mat-menu-item (click)="itemSongOptions('message', x, null)">{{translations?.common?.sendMessage}}</button>
                    <button mat-menu-item (click)="itemSongOptions('newTab', x, null)">{{translations?.common?.openInNewTab}}</button>
                    <button mat-menu-item (click)="itemSongOptions('copyLink', x, null)">{{translations?.common?.copyLink}}</button>
                </mat-menu>
            </div>
        </div>

        <div class="ad" *ngIf="x.contentTypeAd">
            <div class="adContent" [innerHtml]="x.content | safeHtml"></div>
            <div class="disableAdBlock" *ngIf="hideAd">
                {{translations?.common?.disableAdBlock}}
            </div>
        </div>
    </li>
    `
})
export class SongTemplateComponent {
  @Input()
  data;
  item;
  index;
  type;
  translations;
} */