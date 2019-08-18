import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatProgressSpinnerModule,
	MatTooltipModule,
	MatRippleModule
} from '@angular/material';

import { PipesModule } from '../../../../app/core/pipes/pipes.module';

import { ActiveSessionsMobileComponent } from './activeSessionsMobile.component';

const routes: Routes = [
	{
		path: '',
		component: ActiveSessionsMobileComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule
	],
	declarations: [
		ActiveSessionsMobileComponent
	],
	exports: [
		ActiveSessionsMobileComponent
	]
})
export class ActiveSessionsMobileModule {}
