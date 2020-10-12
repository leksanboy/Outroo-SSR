import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class PlayerService {
	private subjectSetData = new Subject<any>();
	private subjectPlayTrack = new Subject<any>();
	private subjectCurrentTrack = new Subject<any>();
	private subjectCoverTrack = new Subject<any>();

	setData(data: string) {
		this.subjectSetData.next(data);
	}

	getData(): Observable<any> {
		return this.subjectSetData.asObservable();
	}

	setPlayTrack(data: any) {
		this.subjectPlayTrack.next(data);
	}

	getPlayTrack(): Observable<any> {
		return this.subjectPlayTrack.asObservable();
	}

	setCurrentTrack(data: any) {
		this.subjectCurrentTrack.next(data);
	}

	getCurrentTrack(): Observable<any> {
		return this.subjectCurrentTrack.asObservable();
	}

	setCoverTrack(data: any) {
		this.subjectCoverTrack.next(data);
	}

	getCoverTrack(): Observable<any> {
		return this.subjectCoverTrack.asObservable();
	}
}
