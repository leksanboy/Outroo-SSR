import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserResolver } from './core/services/resolve/user.service';
import { LoginValidationResolver } from './core/services/resolve/loginValidation.service';
import { PageResolver } from './core/services/resolve/page.resolver';

const routes: Routes = [
	{ path: '', pathMatch: 'full', 		resolve: {loginValidationResolvedData: LoginValidationResolver}, 				loadChildren: './pages/web/home/home.module#HomeModule'},
	{ path: 'home', 					data: {pageName: `home`}, 				resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/user/home/home.module#HomeModule'},
	{ path: 'about', 					data: {pageName: `about`}, 				resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/web/about/about.module#AboutModule'}, 
	{ path: 'confirm-email/:code', 		data: {pageName: `confirm-email`},		resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/web/confirm-email/confirm-email.module#ConfirmEmailModule'}, 
	{ path: 'reset-password/:code', 	data: {pageName: `reset-password`},		resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/web/reset-password/reset-password.module#ResetPasswordModule'}, 
	{ path: 'forgot-password', 			data: {pageName: `forgot-password`},	resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/web/forgot-password/forgot-password.module#ForgotPasswordModule'}, 
	{ path: 'privacy', 					data: {pageName: `privacy`},			resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/web/privacy/privacy.module#PrivacyModule'}, 
	{ path: 'signin', 					data: {pageName: `signin`}, 			resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/web/signin/signin.module#SigninModule'}, 
	{ path: 'signup', 					data: {pageName: `signup`}, 			resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/web/signup/signup.module#SignupModule'},
	{ path: 'logout', 					data: {pageName: `logout`},				resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/web/logout/logout.module#LogoutModule'},
	{ path: 'support', 					data: {pageName: `support`},			resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/web/support/support.module#SupportModule'},
	{ path: 'saved', 					data: {pageName: `saved`}, 				resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/user/bookmarks/bookmarks.module#BookmarksModule'},
	{ path: 'notifications', 			data: {pageName: `notifications`},		resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/user/notifications/notifications.module#NotificationsModule'},
	{ path: 'settings', 				data: {pageName: `settings`},			resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/user/settings/settings.module#SettingsModule'},
	{ path: 'news', 					data: {pageName: `news`},				resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/user/news/news.module#NewsModule'},
	{ path: 'news/:name', 				data: {pageName: `news_name`},			resolve: {pageResolved: PageResolver}, 	loadChildren: './pages/user/news/news.module#NewsModule'},
	{ path: ':id', 						resolve: {userResolvedData: UserResolver}, loadChildren: './pages/user/main/main.module#MainModule'},
	{ path: ':id/photos', 				loadChildren: './pages/user/photos/photos.module#PhotosModule'},
	{ path: ':id/photos/:name', 		loadChildren: './pages/user/photos/photos.module#PhotosModule'},
	{ path: ':id/audios', 				loadChildren: './pages/user/audios/audios.module#AudiosModule'},
	{ path: ':id/following', 			loadChildren: './pages/user/following/following.module#FollowingModule'},
	{ path: ':id/followers', 			loadChildren: './pages/user/followers/followers.module#FollowersModule'},
	{ path: '**', 						redirectTo: '404', pathMatch: 'full'},
	{ path: '404', 						data: {pageName: `404`},				resolve: {pageResolved: PageResolver},	loadChildren: './pages/web/error/error.module#ErrorModule'}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes, { initialNavigation: 'enabled'})],
	exports: [ RouterModule ],
	providers: [ UserResolver, LoginValidationResolver ]
})
export class AppRoutingModule { }
