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
	MatInputModule
} from '@angular/material';

import { NewReportComponent } from './newReport.component';

const routes: Routes = [
	{
		path: '',
		component: NewReportComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule,
		MatInputModule
	],
	declarations: [
		NewReportComponent
	],
	exports: [
		NewReportComponent
	]
})
export class NewReportModule {}
