import { NgModule } from '@angular/core';

import { AudioDataService } from './user/audioData.service';
import { BookmarksDataService } from './user/bookmarksData.service';
import { ChatDataService } from './user/chatData.service';
import { FollowsDataService } from './user/followsData.service';
import { HeadersService } from './headers/headers.service';
import { MetaService } from './seo/meta.service';
import { MomentService } from './moment/moment.service';
import { NotificationsDataService } from './user/notificationsData.service';
import { PlayerService } from './player/player.service';
import { PhotoDataService } from './user/photoData.service';
import { PublicationsDataService } from './user/publicationsData.service';
import { SessionService } from './session/session.service';
import { UserDataService } from './user/userData.service';
import { SsrService } from './ssr.service';
import { SeoService } from './seo.service';
import { SsrRedirectService } from './ssr.redirect.service';

@NgModule({
	providers: [
		AudioDataService,
		BookmarksDataService,
		ChatDataService,
		FollowsDataService,
		HeadersService,
		MetaService,
		MomentService,
		NotificationsDataService,
		PlayerService,
		PhotoDataService,
		PublicationsDataService,
		SessionService,
		UserDataService,
		SsrService,
		SeoService,
		SsrRedirectService,
	]
})
export class ServicesModule { }
