import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
	MatButtonModule,
	MatButtonToggleModule
} from '@angular/material';

import { AboutComponent } from './about.component';

const routes: Routes = [
	{
		path: '',
		component: AboutComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatButtonToggleModule
	],
	declarations: [ AboutComponent ]
})
export class AboutModule { }
