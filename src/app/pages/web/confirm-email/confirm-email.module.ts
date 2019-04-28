import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatProgressSpinnerModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmEmailComponent } from './confirm-email.component';

const routes: Routes = [
	{
		path: '',
		component: ConfirmEmailComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule
	],
	declarations: [ ConfirmEmailComponent ]
})
export class ConfirmEmailModule { }
