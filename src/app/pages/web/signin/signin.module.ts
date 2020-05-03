import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatProgressSpinnerModule,
	MatInputModule
} from '@angular/material';

import { RecaptchaModule } from 'ng-recaptcha';

import { SigninComponent } from './signin.component';

const routes: Routes = [
	{
		path: '',
		component: SigninComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		RecaptchaModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		MatInputModule
	],
	exports: [ RecaptchaModule ],
	declarations: [ SigninComponent ]
})
export class SigninModule { }
