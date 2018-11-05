import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatProgressSpinnerModule,
	MatRippleModule,
	MatTooltipModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { BookmarksComponent } from './bookmarks.component';

// Entry (Modules are imported on app.module)
import { ShowPhotoComponent } from '../../../../app/pages/common/showPhoto/showPhoto.component';
import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

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
		MatTooltipModule
	],
	declarations: [
		BookmarksComponent
	],
	entryComponents: [
		ShowPhotoComponent,
		ShowPublicationComponent
	]
})
export class BookmarksModule { }
