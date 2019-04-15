import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
	MatAutocompleteModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatBottomSheetModule,
	MatDialogModule,
	MatDividerModule,
	MatInputModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatRippleModule,
	MatSelectModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Extra
import { SwiperModule } from 'angular2-useful-swiper';

// Main
import { MainComponent } from './main.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		SwiperModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatBottomSheetModule,
		MatDialogModule,
		MatDividerModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatTooltipModule
	],
	declarations: [
		MainComponent
	]
})
export class MainModule { }
