import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
import { AlertService } from './core/services/alert/alert.service';
import { ServicesModule } from './core/services/services.module';

// Common Modules
import { NewAvatarModule } from './pages/common/newAvatar/newAvatar.module';
import { NewPlaylistModule } from './pages/common/newPlaylist/newPlaylist.module';
import { NewPublicationModule } from './pages/common/newPublication/newPublication.module';
import { NewReportModule } from './pages/common/newReport/newReport.module';
import { NewSessionModule } from './pages/common/newSession/newSession.module';
import { ShowAvatarModule } from './pages/common/showAvatar/showAvatar.module';
import { NewShareModule } from './pages/common/newShare/newShare.module';
import { ShowLikesModule } from './pages/common/showLikes/showLikes.module';
import { ShowMessageModule } from './pages/common/showMessage/showMessage.module';
import { ShowPlaylistModule } from './pages/common/showPlaylist/showPlaylist.module';
import { ShowPublicationModule } from './pages/common/showPublication/showPublication.module';
import { ActiveSessionsMobileModule } from './pages/common/activeSessionsMobile/activeSessionsMobile.module';
import { ActivePlayerMobileModule } from './pages/common/activePlayerMobile/activePlayerMobile.module';

// Common Components
import { AlertComponent } from './core/services/alert/alert.component';
import { CookiesComponent } from './core/services/cookies/cookies.component';
import { CreateAccountComponent } from './core/services/create-account/create-account.component';
import { ActiveSessionComponent } from './pages/common/activeSession/activeSession.component';

@NgModule({
	declarations: [
		AppComponent,
		AlertComponent,
		CookiesComponent,
		CreateAccountComponent,
		ActiveSessionComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'beatfeel-server' }),
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
		ActivePlayerMobileModule,
		ActiveSessionsMobileModule,
		NewAvatarModule,
		NewPlaylistModule,
		NewPublicationModule,
		NewReportModule,
		NewSessionModule,
		NewShareModule,
		ShowAvatarModule,
		ShowLikesModule,
		ShowMessageModule,
		ShowPlaylistModule,
		ShowPublicationModule
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
	}
}
