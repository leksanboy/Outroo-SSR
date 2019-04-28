import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatButtonToggleModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

import { PrivacyComponent } from './privacy.component';

const routes: Routes = [
	{
		path: '',
		component: PrivacyComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatButtonToggleModule
	],
	declarations: [ PrivacyComponent ]
})
export class PrivacyModule { }
