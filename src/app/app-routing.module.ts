import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserResolver } from './core/services/resolve/user.service';
import { LoginValidationResolver } from './core/services/resolve/loginValidation.service';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadChildren: './pages/web/home/home.module#HomeModule',
		resolve: {
			loginValidationResolvedData: LoginValidationResolver
		}
	}, {
		path: 'about',
		loadChildren: './pages/web/about/about.module#AboutModule'
	}, {
		path: 'confirm-email/:code',
		loadChildren: './pages/web/confirm-email/confirm-email.module#ConfirmEmailModule'
	}, {
		path: 'forgot-password',
		loadChildren: './pages/web/forgot-password/forgot-password.module#ForgotPasswordModule'
	}, {
		path: 'privacy',
		loadChildren: './pages/web/privacy/privacy.module#PrivacyModule'
	}, {
		path: 'reset-password/:code',
		loadChildren: './pages/web/reset-password/reset-password.module#ResetPasswordModule'
	}, {
		path: 'signin',
		loadChildren: './pages/web/signin/signin.module#SigninModule'
	}, {
		path: 'signup',
		loadChildren: './pages/web/signup/signup.module#SignupModule'
	}, {
		path: 'support',
		loadChildren: './pages/web/support/support.module#SupportModule'
	}, {
		path: 'logout',
		loadChildren: './pages/web/logout/logout.module#LogoutModule'
	}, {
		path: 'home',
		loadChildren: './pages/user/home/home.module#HomeModule'
	}, {
		path: 'saved',
		loadChildren: './pages/user/bookmarks/bookmarks.module#BookmarksModule'
	}, {
		path: 'notifications',
		loadChildren: './pages/user/notifications/notifications.module#NotificationsModule'
	}, {
		path: 'settings',
		loadChildren: './pages/user/settings/settings.module#SettingsModule'
	}, {
		path: 'news',
		loadChildren: './pages/user/news/news.module#NewsModule'
	}, {
		path: 'news/:name',
		loadChildren: './pages/user/news/news.module#NewsModule'
	}, {
		path: ':id',
		loadChildren: './pages/user/main/main.module#MainModule',
		resolve: {
			userResolvedData: UserResolver
		}
	}, {
		path: ':id/photos',
		loadChildren: './pages/user/photos/photos.module#PhotosModule'
	}, {
		path: ':id/photos/:name',
		loadChildren: './pages/user/photos/photos.module#PhotosModule'
	}, {
		path: ':id/audios',
		loadChildren: './pages/user/audios/audios.module#AudiosModule'
	}, {
		path: ':id/following',
		loadChildren: './pages/user/following/following.module#FollowingModule'
	}, {
		path: ':id/followers',
		loadChildren: './pages/user/followers/followers.module#FollowersModule'
	}, {
		path: '**',
		loadChildren: './pages/web/error/error.module#ErrorModule'
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ],
	providers: [ UserResolver, LoginValidationResolver ]
})
export class AppRoutingModule { }
