import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

declare var ga: Function;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
	@ViewChild('textCounterEffect') textCounterEffect: ElementRef;
	
	public activeTextEffect: any;
	public listOfPhrases: any = [
		'be the one',
		'be amazing',
		'the world ¬is yours',
		'be the ¬creator ¬of amazing',
		'keep calm ¬and ¬go back ¬to bed',
		'let it be',
		'don\'t ¬pursue ¬happiness, ¬create it',
		'mistakes ¬are proof ¬that ¬you are ¬trying',
		'the ¬perfect ¬time ¬to start ¬something ¬never ¬arrives',
		'do ¬your best ¬to enjoy ¬your day',
		'open ¬your eyes ¬and see ¬the beauty',
		'try hard ¬today',
		'make it ¬simply, but ¬significant',
		'think ¬outside ¬the box',
		'be ¬the best ¬version ¬of you',
		'first learn ¬the rules, ¬then ¬break them',
		'you don\'t ¬get the same ¬moment ¬twice ¬in life',
		'don\'t forget ¬to be ¬awesome',
		'don\'t ¬give up, ¬great ¬things ¬take time',
		'too much ¬ego ¬will kill ¬your ¬talent',
		'the world ¬is full ¬of nice ¬people, ¬if you can\'t ¬find one, ¬be one',
		'if not now, ¬when?',
		'don\'t ¬tell ¬people ¬your ¬dreams, ¬show them',
		'enjoy ¬the little ¬things'
	];
	public environment: any = environment;
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public showPassword: boolean;
	public sessionData: any = [];
	public translations: any = [];
	public activeSessionStatus: boolean;
	public errorMessage: boolean;
	public errorMessageContent: string;

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private userDataService: UserDataService
	) {
		console.log("WEB Home rRendeder");

		// User data from routing resolve
		this.activeSessionStatus = this.activatedRoute.snapshot.data.loginValidationResolvedData;

		// Get translations
		this.getTranslations(1);
	}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'signin';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');

		// Set page title
		this.titleService.setTitle('Outroo');

		// login form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});

		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// If session is set
		if (this.sessionData)
			if (this.sessionData.current)
				this.router.navigate([this.sessionData.current.username]);

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

	ngOnDestroy() {
		if (this.activeTextEffect) {
			clearInterval(this.activeTextEffect);
		}
	}

	// Get translations
	getTranslations(lang) {
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;

				// Set page title
				this.titleService.setTitle(this.environment.name);
			});
	}

	counter(element, value) {
		if (element) {
			// Element
			const nativeElement = element.nativeElement;
			nativeElement.innerHTML = '';

			// Number to count
			const number = value.toString();

			// create an array from the text,
			// prepare to identify which characters in the string are numbers
			const numChars = number.split('');
			const numArray = [];
			const setOfNumbers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

			// for each number, create the animation elements
			for (let i = 0; i < numChars.length; i++) {
				if (setOfNumbers.indexOf(numChars[i]) !== -1) {
					const digit = '<span class="digit-con">\
									<span class="digit' + numArray.length + '">\
										a<br>b<br>c<br>d<br>e<br>f<br>g<br>h<br>i<br>j<br>k<br>l<br>m<br>n<br>o<br>p<br>q<br>r<br>s<br>t<br>u<br>v<br>w<br>x<br>y<br>z<br>\
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
					const top = - (increment * pos(numArray[i])) + 'px';
					child.style.transition = '2s';
					child.style.top = top;
				}
			}
		}
		
		function pos(value){
			if (value === 'a') {
				value = 1;
			} else if (value === 'b') {
				value = 2;
			} else if (value === 'c') {
				value = 3;
			} else if (value === 'd') {
				value = 4;
			} else if (value === 'e') {
				value = 5;
			} else if (value === 'f') {
				value = 6;
			} else if (value === 'g') {
				value = 7;
			} else if (value === 'h') {
				value = 8;
			} else if (value === 'i') {
				value = 9;
			} else if (value === 'j') {
				value = 10;
			} else if (value === 'k') {
				value = 11;
			} else if (value === 'l') {
				value = 12;
			} else if (value === 'm') {
				value = 13;
			} else if (value === 'n') {
				value = 14;
			} else if (value === 'o') {
				value = 15;
			} else if (value === 'p') {
				value = 16;
			} else if (value === 'q') {
				value = 17;
			} else if (value === 'r') {
				value = 18;
			} else if (value === 's') {
				value = 19;
			} else if (value === 't') {
				value = 20;
			} else if (value === 'u') {
				value = 21;
			} else if (value === 'v') {
				value = 22;
			} else if (value === 'w') {
				value = 23;
			} else if (value === 'x') {
				value = 24;
			} else if (value === 'y') {
				value = 25;
			} else if (value === 'z') {
				value = 26;
			}

			return value-1;
		}
	}

	// Submit
	submit(event: Event) {
		this.submitLoading = true;
		this.errorMessage = false;

		if (this.actionForm.get('email').value.trim().length > 0 &&
			this.actionForm.get('password').value.trim().length > 0
		) {
			this.userDataService.login(this.actionForm.get('email').value, this.actionForm.get('password').value)
				.subscribe(
					res => {
						this.router.navigate(['home']);
					},
					error => {
						this.submitLoading = false;
						this.errorMessage = true;
						this.errorMessageContent = this.translations.emailOrPasswordIncorrect;
					}
				);
		} else {
			this.submitLoading = false;
			this.errorMessage = true;
			this.errorMessageContent = this.translations.completeAllFields;
		}
	}
}
