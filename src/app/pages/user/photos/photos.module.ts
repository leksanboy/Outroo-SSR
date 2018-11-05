import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatInputModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatTooltipModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { PhotosComponent } from './photos.component';

const routes: Routes = [
	{
		path: '',
		component: PhotosComponent
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
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatTooltipModule
	],
	declarations: [
		PhotosComponent
	]
})
export class PhotosModule { }
