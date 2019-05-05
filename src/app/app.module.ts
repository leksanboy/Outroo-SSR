import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

// Reactive forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Web aniations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Device detector
import { DeviceDetectorModule } from 'ngx-device-detector';

// Material
import {
	MatBottomSheetModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCheckboxModule,
	MatDialogModule,
	MatDividerModule,
	MatInputModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatRippleModule,
	MatSelectModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatTooltipModule
} from '@angular/material';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Pipe
import { PipesModule } from './core/pipes/pipes.module';

// Services
import { ServicesModule } from './core/services/services.module';

// Common Modules
import { NewAvatarModule } from './pages/common/newAvatar/newAvatar.module';
import { NewPlaylistModule } from './pages/common/newPlaylist/newPlaylist.module';
import { NewPublicationModule } from './pages/common/newPublication/newPublication.module';
import { NewReportModule } from './pages/common/newReport/newReport.module';
import { NewSessionModule } from './pages/common/newSession/newSession.module';
import { ShowAvatarModule } from './pages/common/showAvatar/showAvatar.module';
import { ShowShareModule } from './pages/common/showShare/showShare.module';
import { ShowLikesModule } from './pages/common/showLikes/showLikes.module';
import { ShowPlaylistModule } from './pages/common/showPlaylist/showPlaylist.module';
import { ShowPublicationModule } from './pages/common/showPublication/showPublication.module';
import { ShowSessionPanelMobileModule } from './pages/common/showSessionPanelMobile/showSessionPanelMobile.module';
import { ShowMobilePlayerModule } from './pages/common/showMobilePlayer/showMobilePlayer.module';

// Alert
import { AlertService } from './core/services/alert/alert.service';
import { AlertComponent } from './core/services/alert/alert.component';

// Active ssession
import { ActiveSessionComponent } from './core/services/activeSession/activeSession.component';

// Cookies
import { CookiesComponent } from './core/services/cookies/cookies.component';

@NgModule({
	declarations: [
		AppComponent,
		AlertComponent,
		ActiveSessionComponent,
		CookiesComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'outroo-server' }),
		HttpModule,
		BrowserTransferStateModule,
		HttpClientModule,
		AppRoutingModule,
		// Pipe
		PipesModule,
		// Services
		ServicesModule,
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
		MatDividerModule,
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
		ShowShareModule,
		ShowLikesModule,
		ShowPlaylistModule,
		ShowPublicationModule,
		ShowSessionPanelMobileModule,
		ShowMobilePlayerModule
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
		AlertService
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
