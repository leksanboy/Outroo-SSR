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
	MatTooltipModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { NewsComponent } from './news.component';

const routes: Routes = [
	{
		path: '',
		component: NewsComponent
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
		MatTooltipModule
	],
	declarations: [
		NewsComponent
	]
})
export class NewsModule { }
