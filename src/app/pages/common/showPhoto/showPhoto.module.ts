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

import { PipesModule } from '../../../../app/core/pipes/pipes.module';

import { SwiperModule } from 'angular2-useful-swiper';

import { ShowPhotoComponent } from './showPhoto.component';

const routes: Routes = [
	{
		path: '',
		component: ShowPhotoComponent
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
		ShowPhotoComponent
	],
	exports: [
		ShowPhotoComponent
	]
})
export class ShowPhotoModule {}
