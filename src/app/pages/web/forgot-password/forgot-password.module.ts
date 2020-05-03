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

import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [
	{
		path: '',
		component: ForgotPasswordComponent
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
	declarations: [ ForgotPasswordComponent ]
})
export class ForgotPasswordModule { }
