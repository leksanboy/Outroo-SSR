import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatInputModule,
	MatDividerModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatTabsModule,
	MatTooltipModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { SongComponent } from './song.component';

const routes: Routes = [
	{
		path: '',
		component: SongComponent
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
		MatInputModule,
		MatDividerModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		MatTooltipModule
	],
	declarations: [
		SongComponent
	]
})
export class SongModule { }
