import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatDividerModule,
	MatInputModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatTabsModule,
	MatSelectModule,
	MatTooltipModule,
	MatCheckboxModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { AudiosComponent } from './audios.component';

const routes: Routes = [
	{
		path: '',
		component: AudiosComponent
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
		MatDividerModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		MatSelectModule,
		MatTooltipModule,
		MatCheckboxModule
	],
	declarations: [
		AudiosComponent
	]
})
export class AudiosModule { }
