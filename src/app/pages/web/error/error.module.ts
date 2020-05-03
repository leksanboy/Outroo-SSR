import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
	MatButtonModule,
	MatButtonToggleModule
} from '@angular/material';

import { ErrorComponent } from './error.component';

const routes: Routes = [
	{
		path: '',
		component: ErrorComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatButtonToggleModule
	],
	declarations: [ ErrorComponent ]
})
export class ErrorModule { }
