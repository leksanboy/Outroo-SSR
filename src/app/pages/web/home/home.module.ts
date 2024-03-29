import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatInputModule
} from '@angular/material';

import { RecaptchaModule } from 'ng-recaptcha';

import { HomeComponent } from './home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent
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
		MatMenuModule,
		MatProgressSpinnerModule,
		MatInputModule
	],
	exports: [ RecaptchaModule ],
	declarations: [ HomeComponent ]
})
export class HomeModule { }
