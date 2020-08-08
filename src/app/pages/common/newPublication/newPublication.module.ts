import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatInputModule,
	MatSelectModule,
	MatProgressSpinnerModule,
	MatSlideToggleModule,
	MatTooltipModule,
	MatRippleModule,
	MatMenuModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Entry
import { NewPublicationComponent } from './newPublication.component';
import { NewPublicationAddAudiosComponent } from './addAudios/addAudios.component';

const routes: Routes = [
	{
		path: '',
		component: NewPublicationComponent
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
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatSelectModule,
		MatProgressSpinnerModule,
		MatSlideToggleModule,
		MatTooltipModule,
		MatRippleModule,
		MatMenuModule
	],
	declarations: [
		NewPublicationComponent,
		NewPublicationAddAudiosComponent
	],
	exports: [
		NewPublicationComponent,
		NewPublicationAddAudiosComponent
	],
	entryComponents: [
		NewPublicationAddAudiosComponent
	]
})
export class NewPublicationModule {}
