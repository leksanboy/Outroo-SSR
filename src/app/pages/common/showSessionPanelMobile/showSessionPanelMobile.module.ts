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

import { ShowSessionPanelMobileComponent } from './showSessionPanelMobile.component';

const routes: Routes = [
	{
		path: '',
		component: ShowSessionPanelMobileComponent
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
		ShowSessionPanelMobileComponent
	],
	exports : [
		ShowSessionPanelMobileComponent
	]
})
export class ShowSessionPanelMobileModule {}
