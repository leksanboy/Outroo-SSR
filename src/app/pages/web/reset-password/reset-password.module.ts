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

import { ResetPasswordComponent } from './reset-password.component';

const routes: Routes = [
	{
		path: '',
		component: ResetPasswordComponent
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
	declarations: [ ResetPasswordComponent ]
})
export class ResetPasswordModule { }
