import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatProgressSpinnerModule,
	MatTooltipModule,
	MatRippleModule,
	MatInputModule,
	MatMenuModule,
	MatChipsModule
} from '@angular/material';

import { PipesModule } from '../../../../app/core/pipes/pipes.module';

import { ShowShareComponent } from './showShare.component';

const routes: Routes = [
	{
		path: '',
		component: ShowShareComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule,
		MatInputModule,
		MatMenuModule,
		MatChipsModule
	],
	declarations: [
		ShowShareComponent
	],
	exports: [
		ShowShareComponent
	]
})
export class ShowShareModule {}
