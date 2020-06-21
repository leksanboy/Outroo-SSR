import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { MetaService } from '../../../../app/core/services/seo/meta.service';
import { SsrService } from '../../../../app/core/services/ssr.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

declare var global: any;
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
	@ViewChild('textCounterEffect') textCounterEffect: ElementRef;
	public env: any = environment;
	public window: any = global;
	public translations: any = [];
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public showPassword: boolean;
	public sessionData: any = [];
	public activeSessionStatus: boolean;
	public errorMessage: boolean;
	public errorMessageContent: string;
	public activeTextEffect: any;
	public listOfPhrases: any = [];
	public colors = ['yellow', 'purple', 'blue', 'red', 'green'];
	public randColor = this.colors[Math.floor(Math.random() * 5) + 0];
	public dataDefault: any = [];
	public audioPlayerData: any = [];
	public activePlayerInformation: any;

	constructor(
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private metaService: MetaService,
		private router: Router,
		private userDataService: UserDataService,
		private sessionService: SessionService,
		private ssrService: SsrService,
		private audioDataService: AudioDataService,
		private playerService: PlayerService,
	) {
		// Get translations
		this.translations = this.activatedRoute.snapshot.data.langResolvedData;
		this.listOfPhrases = this.translations.common.listOfPhrases;

		// Set meta / Only in home page
		this.setMetaData(this.translations);

		// User data from routing resolve
		this.activeSessionStatus = this.activatedRoute.snapshot.data.loginValidationResolvedData;

		// Get player data
		this.activePlayerInformation = this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});

		// Set Google analytics
		const url = 'home';
		const userId = null;
		this.userDataService.analytics(url, 'Outroo', userId);
	}

	ngOnInit() {
		// login form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});

		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// If session is set
		if (this.sessionData) {
			if (this.sessionData.current) {
				this.router.navigate([this.sessionData.current.username]);
			}
		} else {
			// Get song
			let rand = Math.floor(Math.random() * 2900) + 1;
			this.getSong(rand);
		}

		if (this.ssrService.isBrowser) {
			// Counter phrases
			const self = this;

			this.activeTextEffect = setTimeout(function() {
				const rand = Math.floor(Math.random() * self.listOfPhrases.length);
				self.counter(self.textCounterEffect, self.listOfPhrases[rand]);
			}, 100);

			this.activeTextEffect = setInterval(function() {
				const rand = Math.floor(Math.random() * self.listOfPhrases.length);
				self.counter(self.textCounterEffect, self.listOfPhrases[rand]);
			}, 13000);
		}
	}

	ngOnDestroy() {
		this.activePlayerInformation.unsubscribe();

		if (this.activeTextEffect) {
			clearInterval(this.activeTextEffect);
		}
	}

	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
				this.listOfPhrases = this.translations.common.listOfPhrases;
				this.setMetaData(data);
			});
	}

	setLang(lang) {
		this.sessionService.setDataLanguage(lang);
		this.getTranslations(lang);
	}

	setMetaData(data) {
		const metaData = {
			page: data.home.title,
			title: data.home.title,
			description: data.home.description,
			keywords: data.home.description,
			url: this.env.url + '/',
			image: this.env.url + 'assets/images/image_color.png'
		};
		this.metaService.setData(metaData);
	}

	getSong(id) {
		const data = {
			id: id
		};

		this.audioDataService.getSong(data)
			.subscribe((res: any) => {
				if (!res || res.length === 0) {
					this.dataDefault.noData = true;
				} else {
					this.dataDefault.data = res;
				}
			}, error => {
				this.dataDefault.noData = true;
			});
	}

	playSong(data, item, key, type) {
		if (this.audioPlayerData.key === key &&
			this.audioPlayerData.type === type &&
			this.audioPlayerData.item.song === item.song
		) { // Play/Pause current
			item.playing = !item.playing;
			this.playerService.setPlayTrack(this.audioPlayerData);
		} else { // Play new one
			this.audioPlayerData.list = [data];
			this.audioPlayerData.item = item;
			this.audioPlayerData.key = key;
			/* this.audioPlayerData.user = this.sessionData.current.id;
			this.audioPlayerData.username = this.sessionData.current.username; */
			this.audioPlayerData.location = 'home';
			this.audioPlayerData.type = type;

			this.playerService.setData(this.audioPlayerData);
			item.playing = true;
		}
	}

	counter(element, value) {
		let setOfNumbers;
		if (this.translations.common.langCode === 'en_US') {
			setOfNumbers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		} else if (this.translations.common.langCode === 'es_ES') {
			setOfNumbers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		} else if (this.translations.common.langCode === 'ru_RU') {
			setOfNumbers = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
		}

		if (element) {
			// Element
			const nativeElement = element.nativeElement;
			nativeElement.innerHTML = '';

			// Number to count
			const number = value.toString();

			// create an array from the text, prepare to identify which characters in the string are numbers
			const numChars = number.split('');
			const numArray = [];

			// create list of strings for html
			let charsArray = '';
			for (const c of setOfNumbers) {
				charsArray += (c + '<br>');
			}

			// for each number, create the animation elements
			for (let i = 0; i < numChars.length; i++) {
				if (setOfNumbers.indexOf(numChars[i]) !== -1) {
					const digit = '<span class="digit-con">\
									<span class="digit-in digit' + numArray.length + '">\
										' + charsArray + '\
									</span>\
								</span>';

					nativeElement.insertAdjacentHTML('beforeend', digit);
					numArray[numArray.length] = numChars[i];
				} else {
					let digit = '';

					if (numChars[i] === '¬') {
						digit = '<span><br></span>';
					} else {
						digit = '<span>' + numChars[i] + '</span>';
					}

					nativeElement.insertAdjacentHTML('beforeend', digit);
					numArray[numArray.length] = numChars[i];
				}
			}

			// determine the height of each number for the animation
			const increment = nativeElement.children[0].offsetHeight;

			// animate each number
			for (let i = 0; i < numArray.length; i++) {
				const child = nativeElement.children[i].children[0];

				if (child) {
					const top = - ( increment * setOfNumbers.indexOf(numArray[i]) ) + 'px';
					child.style.transition = '2s';
					child.style.top = top;
				}
			}
		}
	}

	submit(event: Event) {
		const form = this.actionForm.value;
		this.submitLoading = true;
		this.errorMessage = false;

		if (form.email.trim().length > 0 && form.password.trim().length > 0) {
			let params = {
				type: 'normal',
				username: form.email,
				password: form.password
			};

			this.userDataService.login(params)
				.subscribe(res => {
					//this.router.navigate([this.env.defaultPage]);
					this.window.location.href = this.env.defaultPage;
				}, error => {
					this.submitLoading = false;

					// show error message
					this.errorMessage = true;
					this.errorMessageContent = this.translations.common.emailOrPasswordIncorrect;
				});
		} else {
			this.submitLoading = false;
			this.errorMessage = true;
			this.errorMessageContent = this.translations.common.completeAllFields;
		}
	}

	socialLogin(type) {
		this.sessionService.setSocialLogin(type);
	}
}
