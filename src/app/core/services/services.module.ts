import { NgModule } from '@angular/core';

import { AudioDataService } from './user/audioData.service';
import { BookmarksDataService } from './user/bookmarksData.service';
import { FollowsDataService } from './user/followsData.service';
import { HeadersService } from './headers/headers.service';
import { MetaService } from './seo/meta.service';
import { MomentService } from './moment/moment.service';
import { NotificationsDataService } from './user/notificationsData.service';
import { PlayerService } from './player/player.service';
import { PublicationsDataService } from './user/publicationsData.service';
import { SessionService } from './session/session.service';
import { UserDataService } from './user/userData.service';
import { SsrService } from './ssr.service';

@NgModule({
	providers: [
		AudioDataService,
		BookmarksDataService,
		FollowsDataService,
		HeadersService,
		MetaService,
		MomentService,
		NotificationsDataService,
		PlayerService,
		PublicationsDataService,
		SessionService,
		UserDataService,
		SsrService
	]
})
export class ServicesModule {}
