import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatTooltipModule,
	MatRippleModule,
	MatSliderModule

} from '@angular/material';

import { PipesModule } from '../../../../app/core/pipes/pipes.module';

import { ShowMobilePlayerComponent } from './showMobilePlayer.component';

const routes: Routes = [
	{
		path: '',
		component: ShowMobilePlayerComponent
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
		MatMenuModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule,
		MatSliderModule
	],
	declarations: [
		ShowMobilePlayerComponent
	],
	exports: [
		ShowMobilePlayerComponent
	]
})
export class ShowMobilePlayerModule {}
