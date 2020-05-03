import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatInputModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatTooltipModule
} from '@angular/material';

// Main
import { FollowersComponent } from './followers.component';

const routes: Routes = [
	{
		path: '',
		component: FollowersComponent
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
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatTooltipModule
	],
	declarations: [
		FollowersComponent
	]
})
export class FollowersModule { }
