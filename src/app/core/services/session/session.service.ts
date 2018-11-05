import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SessionService {
    private subjectSetData = new Subject<any>();
    private subjectPendingNotifications = new Subject<any>();
    private subjectSetDataPlaylists = new Subject<any>();
    private subjectSetDataCreatePlaylist = new Subject<any>();
    private subjectSetDataAddAccount = new Subject<any>();
    private subjectSetDataTheme = new Subject<any>();
    private subjectSetDataLanguage = new Subject<any>();
    private subjectSetDataReport = new Subject<any>();
    private subjectSetDataCopy = new Subject<any>();
    private subjectSetDataShowConversation = new Subject<any>();
    private subjectSetDataShowPublication = new Subject<any>();
    private subjectSetDataShowPhoto = new Subject<any>();
    private subjectSetDataShowLikes = new Subject<any>();
    private subjectClickElementRef = new Subject<any>();
    private subjectSetDataShowAvatar = new Subject<any>();
    private subjectSetDataNewPublication = new Subject<any>();

    setData(data: string) {
        this.subjectSetData.next(data);
    }

    getData(): Observable<any> {
        return this.subjectSetData.asObservable();
    }

    setPendingNotifications(data: string) {
        this.subjectPendingNotifications.next(data);
    }

    getPendingNotifications(): Observable<any> {
        return this.subjectPendingNotifications.asObservable();
    }

    setDataPlaylists(data: string) {
        this.subjectSetDataPlaylists.next(data);
    }

    getDataPlaylists(): Observable<any> {
        return this.subjectSetDataPlaylists.asObservable();
    }

    setDataCreatePlaylist(data: any) {
        this.subjectSetDataCreatePlaylist.next(data);
    }

    getDataCreatePlaylist(): Observable<any> {
        return this.subjectSetDataCreatePlaylist.asObservable();
    }

    setDataAddAccount(data: any) {
        this.subjectSetDataAddAccount.next(data);
    }

    getDataAddAccount(): Observable<any> {
        return this.subjectSetDataAddAccount.asObservable();
    }

    setDataTheme(data: any) {
        this.subjectSetDataTheme.next(data);
    }

    getDataTheme(): Observable<any> {
        return this.subjectSetDataTheme.asObservable();
    }

    setDataLanguage(data: any) {
        this.subjectSetDataLanguage.next(data);
    }

    getDataLanguage(): Observable<any> {
        return this.subjectSetDataLanguage.asObservable();
    }

    setDataReport(data: any) {
        this.subjectSetDataReport.next(data);
    }

    getDataReport(): Observable<any> {
        return this.subjectSetDataReport.asObservable();
    }

    setDataCopy(data: any) {
        this.subjectSetDataCopy.next(data);
    }

    getDataCopy(): Observable<any> {
        return this.subjectSetDataCopy.asObservable();
    }

    setDataShowConversation(data: any) {
        this.subjectSetDataShowConversation.next(data);
    }

    getDataShowConversation(): Observable<any> {
        return this.subjectSetDataShowConversation.asObservable();
    }

    setDataShowPublication(data: any) {
        this.subjectSetDataShowPublication.next(data);
    }

    getDataShowPublication(): Observable<any> {
        return this.subjectSetDataShowPublication.asObservable();
    }

    setDataShowPhoto(data: any) {
        this.subjectSetDataShowPhoto.next(data);
    }

    getDataShowPhoto(): Observable<any> {
        return this.subjectSetDataShowPhoto.asObservable();
    }

    setDataShowLikes(data: any) {
        this.subjectSetDataShowLikes.next(data);
    }

    getDataShowLikes(): Observable<any> {
        return this.subjectSetDataShowLikes.asObservable();
    }

    setDataClickElementRef(data: any) {
        this.subjectClickElementRef.next(data);
    }

    getDataClickElementRef(): Observable<any> {
        return this.subjectClickElementRef.asObservable();
    }

    setDataShowAvatar(data: any) {
        this.subjectSetDataShowAvatar.next(data);
    }

    getDataShowAvatar(): Observable<any> {
        return this.subjectSetDataShowAvatar.asObservable();
    }

    setDataNewPublication(data: any) {
        this.subjectSetDataNewPublication.next(data);
    }

    getDataNewPublication(): Observable<any> {
        return this.subjectSetDataNewPublication.asObservable();
    }
}
