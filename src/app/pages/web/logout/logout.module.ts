import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatButtonToggleModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

import { LogoutComponent } from './logout.component';

const routes: Routes = [
	{
		path: '',
		component: LogoutComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatButtonToggleModule
	],
	declarations: [ LogoutComponent ]
})
export class LogoutModule { }
