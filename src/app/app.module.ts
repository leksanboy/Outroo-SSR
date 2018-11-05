import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

// Reactive forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Web aniations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material
import {
	MatAutocompleteModule,
	MatBadgeModule,
	MatBottomSheetModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule,
	MatDialogModule,
	MatDividerModule,
	MatExpansionModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatSnackBarModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTreeModule
} from '@angular/material';

// Pipe
import { PipesModule } from './core/pipes/pipes.module';

// Device detector
import { DeviceDetectorModule } from 'ngx-device-detector';

// Services
import { AudioDataService } from './core/services/user/audioData.service';
import { BookmarksDataService } from './core/services/user/bookmarksData.service';
import { FollowsDataService } from './core/services/user/followsData.service';
import { ChatDataService } from './core/services/user/chatData.service';
import { NotificationsDataService } from './core/services/user/notificationsData.service';
import { PhotoDataService } from './core/services/user/photoData.service';
import { PublicationsDataService } from './core/services/user/publicationsData.service';
import { UserDataService } from './core/services/user/userData.service';
import { SessionService } from './core/services/session/session.service';
import { PlayerService } from './core/services/player/player.service';
import { MetaService } from './core/services/seo/meta.service';
import { MomentService } from './core/services/moment/moment.service';
import { HeadersService } from './core/services/headers/headers.service';

// Common Folder Modules
import { NewAvatarModule } from './pages/common/newAvatar/newAvatar.module';
import { NewPlaylistModule } from './pages/common/newPlaylist/newPlaylist.module';
import { NewPublicationModule } from './pages/common/newPublication/newPublication.module';
import { NewReportModule } from './pages/common/newReport/newReport.module';
import { NewSessionModule } from './pages/common/newSession/newSession.module';
import { ShowAvatarModule } from './pages/common/showAvatar/showAvatar.module';
import { ShowConversationModule } from './pages/common/showConversation/showConversation.module';
import { ShowLikesModule } from './pages/common/showLikes/showLikes.module';
import { ShowPhotoModule } from './pages/common/showPhoto/showPhoto.module';
import { ShowPlaylistModule } from './pages/common/showPlaylist/showPlaylist.module';
import { ShowPublicationModule } from './pages/common/showPublication/showPublication.module';
import { ShowSessionPanelMobileModule } from './pages/common/showSessionPanelMobile/showSessionPanelMobile.module';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Alert
import { AlertService } from './core/services/alert/alert.service';
import { AlertComponent } from './core/services/alert/alert.component';

// Audio player mobile
import { PlayerMobileService } from './core/services/playerMobile/playerMobile.service';
import { PlayerMobileComponent } from './core/services/playerMobile/playerMobile.component';

// Active ssession
import { ActiveSessionComponent } from './core/services/activeSession/activeSession.component';

@NgModule({
	declarations: [
		AppComponent,
		AlertComponent,
		PlayerMobileComponent,
		ActiveSessionComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'outroo-server' }),
		HttpModule,
		HttpClientModule,
		AppRoutingModule,
		// Pipe
		PipesModule,
		// Device detector
		DeviceDetectorModule.forRoot(),
		// Forms
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		// Material
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatTooltipModule,
		// Common modules
		NewAvatarModule,
		NewPlaylistModule,
		NewPublicationModule,
		NewReportModule,
		NewSessionModule,
		ShowAvatarModule,
		ShowConversationModule,
		ShowLikesModule,
		ShowPhotoModule,
		ShowPlaylistModule,
		ShowPublicationModule,
		ShowSessionPanelMobileModule
	],
	exports: [
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatTooltipModule
	],
	providers: [
		AlertService,
		PlayerMobileService,
		AudioDataService,
		BookmarksDataService,
		ChatDataService,
		FollowsDataService,
		HeadersService,
		MetaService,
		MomentService,
		NotificationsDataService,
		PhotoDataService,
		PlayerService,
		PublicationsDataService,
		SessionService,
		UserDataService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {
	constructor(
	    @Inject(PLATFORM_ID) private platformId: Object,
	    @Inject(APP_ID) private appId: string
	) {
    	const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
    	console.log(`Running ${platform} with appId=${appId}`);
	}
}
