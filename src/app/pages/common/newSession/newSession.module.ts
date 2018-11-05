import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
	MatButtonModule, 
	MatButtonToggleModule,
	MatDialogModule, 
	MatProgressSpinnerModule, 
	MatTooltipModule,
	MatRippleModule,
	MatInputModule
} from '@angular/material';

import { NewSessionComponent } from './newSession.component';

const routes: Routes = [
	{
		path: '',
		component: NewSessionComponent
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
		MatTooltipModule,
		MatRippleModule,
		MatInputModule
	],
	declarations: [
		NewSessionComponent
	],
	exports : [
		NewSessionComponent
	]
})
export class NewSessionModule {}
