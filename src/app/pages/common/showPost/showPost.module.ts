import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatDividerModule,
	MatProgressSpinnerModule,
	MatTooltipModule,
	MatRippleModule,
	MatMenuModule
} from '@angular/material';

import { PipesModule } from '../../../core/pipes/pipes.module';

import { SwiperModule } from 'angular2-useful-swiper';

import { showPostComponent } from './showPost.component';

const routes: Routes = [
	{
		path: '',
		component: showPostComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		SwiperModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatDividerModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule,
		MatMenuModule
	],
	declarations: [
		showPostComponent
	],
	exports: [
		showPostComponent
	]
})
export class showPostModule {}
