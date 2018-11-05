import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
	MatButtonModule, 
	MatButtonToggleModule, 
	MatDialogModule,
	MatInputModule,
	MatProgressSpinnerModule, 
	MatTooltipModule,
	MatRippleModule,
	MatMenuModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Entry
import { NewPublicationComponent } from './newPublication.component';
import { NewPublicationAddAudiosComponent } from './addAudios/addAudios.component';
import { NewPublicationAddPhotosComponent } from './addPhotos/addPhotos.component';

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
		MatButtonModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule,
		MatMenuModule
	],
	declarations: [
		NewPublicationComponent,
		NewPublicationAddAudiosComponent,
		NewPublicationAddPhotosComponent
	],
	exports: [
		NewPublicationComponent,
		NewPublicationAddAudiosComponent,
		NewPublicationAddPhotosComponent
	],
	entryComponents: [
		NewPublicationAddAudiosComponent,
		NewPublicationAddPhotosComponent
	]
})
export class NewPublicationModule {}
