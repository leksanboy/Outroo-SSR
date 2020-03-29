import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LangResolver } from './core/services/resolve/lang.service';
import { LoginResolver } from './core/services/resolve/login.service';
import { SessionResolver } from './core/services/resolve/session.service';
import { UserResolver } from './core/services/resolve/user.service';

const routes: Routes = [
	{
		path: '', pathMatch: 'full', 		loadChildren: './pages/web/home/home.module#HomeModule', 									resolve: { langResolvedData: LangResolver, loginValidationResolvedData: LoginResolver } 							}, {
		path: 'about', 						loadChildren: './pages/web/about/about.module#AboutModule', 								resolve: { langResolvedData: LangResolver }																			}, {
		path: 'confirm-email/:code',		loadChildren: './pages/web/confirm-email/confirm-email.module#ConfirmEmailModule',			resolve: { langResolvedData: LangResolver }																			}, {
		path: 'forgot-password',			loadChildren: './pages/web/forgot-password/forgot-password.module#ForgotPasswordModule',	resolve: { langResolvedData: LangResolver }																			}, {
		path: 'logout',						loadChildren: './pages/web/logout/logout.module#LogoutModule',								resolve: { langResolvedData: LangResolver }																			}, {
		path: 'privacy',					loadChildren: './pages/web/privacy/privacy.module#PrivacyModule',							resolve: { langResolvedData: LangResolver }																			}, {
		path: 'reset-password/:code',		loadChildren: './pages/web/reset-password/reset-password.module#ResetPasswordModule',		resolve: { langResolvedData: LangResolver }																			}, {
		path: 'signin',						loadChildren: './pages/web/signin/signin.module#SigninModule',								resolve: { langResolvedData: LangResolver }																			}, {
		path: 'signup',						loadChildren: './pages/web/signup/signup.module#SignupModule',								resolve: { langResolvedData: LangResolver }																			}, {
		path: 'support',					loadChildren: './pages/web/support/support.module#SupportModule',							resolve: { langResolvedData: LangResolver }																			}, {
		path: 'home',						loadChildren: './pages/user/home/home.module#HomeModule',									resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver }									}, {
		path: 'news',						loadChildren: './pages/user/news/news.module#NewsModule',									resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver }									}, {
		path: 'news/:name',					loadChildren: './pages/user/news/news.module#NewsModule',									resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver }									}, {
		path: 'p/:name',					loadChildren: './pages/user/post/post.module#PostModule',									resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver }									}, {
		path: 's/:name',					loadChildren: './pages/user/song/song.module#SongModule',									resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver }									}, {
		path: 'pl/:name',					loadChildren: './pages/user/playlist/playlist.module#PlaylistModule',						resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver }									}, {
		path: 'notifications',				loadChildren: './pages/user/notifications/notifications.module#NotificationsModule',		resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver }									}, {
		path: 'saved',						loadChildren: './pages/user/bookmarks/bookmarks.module#BookmarksModule',					resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver }									}, {
		path: 'settings',					loadChildren: './pages/user/settings/settings.module#SettingsModule',						resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver }									}, {
		path: ':id',						loadChildren: './pages/user/main/main.module#MainModule',									resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver, userResolvedData: UserResolver }	}, {
		path: ':id/songs',					loadChildren: './pages/user/audios/audios.module#AudiosModule',								resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver, userResolvedData: UserResolver }	}, {
		path: ':id/following',				loadChildren: './pages/user/following/following.module#FollowingModule',					resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver, userResolvedData: UserResolver }	}, {
		path: ':id/followers',				loadChildren: './pages/user/followers/followers.module#FollowersModule',					resolve: { langResolvedData: LangResolver, sessionResolvedData: SessionResolver, userResolvedData: UserResolver }	}, {
		path: '**',							loadChildren: './pages/web/error/error.module#ErrorModule',									resolve: { langResolvedData: LangResolver }
	}
];

@NgModule({
	imports: 	[ RouterModule.forRoot(routes, {initialNavigation: 'enabled'}) 	],
	exports: 	[ RouterModule ],
	providers: 	[ LangResolver, LoginResolver, SessionResolver, UserResolver 	]
})
export class AppRoutingModule {}
