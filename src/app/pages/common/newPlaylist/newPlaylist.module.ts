import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatProgressSpinnerModule,
	MatMenuModule,
	MatDividerModule,
	MatTooltipModule,
	MatRippleModule,
	MatInputModule,
	MatSelectModule,
	MatSlideToggleModule,
	MatCheckboxModule
} from '@angular/material';

import { NewPlaylistComponent } from './newPlaylist.component';

const routes: Routes = [
	{
		path: '',
		component: NewPlaylistComponent
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
		MatMenuModule,
		MatDividerModule,
		MatTooltipModule,
		MatRippleModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatCheckboxModule
	],
	declarations: [
		NewPlaylistComponent
	],
	exports : [
		NewPlaylistComponent
	]
})
export class NewPlaylistModule {}
