import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatProgressSpinnerModule,
	MatRippleModule,
	MatTooltipModule,
	MatTabsModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { BookmarksComponent } from './bookmarks.component';

const routes: Routes = [
	{
		path: '',
		component: BookmarksComponent
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
		MatRippleModule,
		MatTooltipModule,
		MatTabsModule
	],
	declarations: [
		BookmarksComponent
	]
})
export class BookmarksModule { }
