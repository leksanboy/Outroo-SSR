import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatProgressSpinnerModule,
	MatTooltipModule,
	MatRippleModule,
	MatMenuModule
} from '@angular/material';

import { PipesModule } from '../../../../app/core/pipes/pipes.module';

import { ShowLikesComponent } from './showLikes.component';

const routes: Routes = [
	{
		path: '',
		component: ShowLikesComponent
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
		MatRippleModule,
		MatMenuModule
	],
	declarations: [
		ShowLikesComponent
	],
	exports: [
		ShowLikesComponent
	]
})
export class ShowLikesModule {}
