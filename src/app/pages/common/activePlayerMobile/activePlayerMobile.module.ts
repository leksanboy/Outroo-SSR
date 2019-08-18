import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatDividerModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatTooltipModule,
	MatRippleModule,
	MatSliderModule

} from '@angular/material';

import { PipesModule } from '../../../../app/core/pipes/pipes.module';

import { ActivePlayerMobileComponent } from './activePlayerMobile.component';

const routes: Routes = [
	{
		path: '',
		component: ActivePlayerMobileComponent
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
		MatDividerModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule,
		MatSliderModule
	],
	declarations: [
		ActivePlayerMobileComponent
	],
	exports: [
		ActivePlayerMobileComponent
	]
})
export class ActivePlayerMobileModule {}
