import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SessionService {
	private subjectClickElementRef = new Subject<any>();
	private subjectAddAccount = new Subject<any>();
	private subjectCopy = new Subject<any>();
	private subjectCreatePlaylist = new Subject<any>();
	private subjectLanguage = new Subject<any>();
	private subjectNewPublication = new Subject<any>();
	private subjectPlaylists = new Subject<any>();
	private subjectTheme = new Subject<any>();
	private subjectPendingNotifications = new Subject<any>();
	private subjectReport = new Subject<any>();
	private subjectSetData = new Subject<any>();
	private subjectShowMessage = new Subject<any>();
	private subjectNewShare = new Subject<any>();
	private subjectShowAvatar = new Subject<any>();
	private subjectShowLikes = new Subject<any>();
	private subjectShowPhoto = new Subject<any>();
	private subjectShowPublication = new Subject<any>();
	private subjectLastUrl = new Subject<any>();
	private subjectComeFromUserButton = new Subject<any>();
	private subjectNotificationsBox = new Subject<any>();
	private subjectSocialLogin = new Subject<any>();

	setDataClickElementRef(data: any) {
		this.subjectClickElementRef.next(data);
	}

	getDataClickElementRef(): Observable<any> {
		return this.subjectClickElementRef.asObservable();
	}

	setDataAddAccount(data: any) {
		this.subjectAddAccount.next(data);
	}

	getDataAddAccount(): Observable<any> {
		return this.subjectAddAccount.asObservable();
	}

	setDataCopy(data: any) {
		this.subjectCopy.next(data);
	}

	getDataCopy(): Observable<any> {
		return this.subjectCopy.asObservable();
	}

	setDataCreatePlaylist(data: any) {
		this.subjectCreatePlaylist.next(data);
	}

	getDataCreatePlaylist(): Observable<any> {
		return this.subjectCreatePlaylist.asObservable();
	}

	setDataLanguage(data: any) {
		this.subjectLanguage.next(data);
	}

	getDataLanguage(): Observable<any> {
		return this.subjectLanguage.asObservable();
	}

	setDataNewPublication(data: any) {
		this.subjectNewPublication.next(data);
	}

	getDataNewPublication(): Observable<any> {
		return this.subjectNewPublication.asObservable();
	}

	setDataPlaylists(data: any) {
		this.subjectPlaylists.next(data);
	}

	getDataPlaylists(): Observable<any> {
		return this.subjectPlaylists.asObservable();
	}

	setDataTheme(data: any) {
		this.subjectTheme.next(data);
	}

	getDataTheme(): Observable<any> {
		return this.subjectTheme.asObservable();
	}

	setPendingNotifications(data: any) {
		this.subjectPendingNotifications.next(data);
	}

	getPendingNotifications(): Observable<any> {
		return this.subjectPendingNotifications.asObservable();
	}

	setDataReport(data: any) {
		this.subjectReport.next(data);
	}

	getDataReport(): Observable<any> {
		return this.subjectReport.asObservable();
	}

	setData(data: any) {
		this.subjectSetData.next(data);
	}

	getData(): Observable<any> {
		return this.subjectSetData.asObservable();
	}

	setDataShowMessage(data: any) {
		this.subjectShowMessage.next(data);
	}

	getDataShowMessage(): Observable<any> {
		return this.subjectShowMessage.asObservable();
	}

	setDataNewShare(data: any) {
		this.subjectNewShare.next(data);
	}

	getDataNewShare(): Observable<any> {
		return this.subjectNewShare.asObservable();
	}

	setDataShowAvatar(data: any) {
		this.subjectShowAvatar.next(data);
	}

	getDataShowAvatar(): Observable<any> {
		return this.subjectShowAvatar.asObservable();
	}

	setDataShowLikes(data: any) {
		this.subjectShowLikes.next(data);
	}

	getDataShowLikes(): Observable<any> {
		return this.subjectShowLikes.asObservable();
	}

	setDataShowPhoto(data: any) {
		this.subjectShowPhoto.next(data);
	}

	getDataShowPhoto(): Observable<any> {
		return this.subjectShowPhoto.asObservable();
	}

	setDataShowPublication(data: any) {
		this.subjectShowPublication.next(data);
	}

	getDataShowPublication(): Observable<any> {
		return this.subjectShowPublication.asObservable();
	}

	setDataLastUrl(data: any) {
		this.subjectLastUrl.next(data);
	}

	getDataLastUrl(): Observable<any> {
		return this.subjectLastUrl.asObservable();
	}

	setComeFromUserButton(data: any) {
		this.subjectComeFromUserButton.next(data);
	}

	getComeFromUserButton(): Observable<any> {
		return this.subjectComeFromUserButton.asObservable();
	}

	setNotificationsBox(data: any) {
		this.subjectNotificationsBox.next(data);
	}

	getNotificationsBox(): Observable<any> {
		return this.subjectNotificationsBox.asObservable();
	}

	setSocialLogin(data: any) {
		this.subjectSocialLogin.next(data);
	}

	getSocialLogin(): Observable<any> {
		return this.subjectSocialLogin.asObservable();
	}
}
