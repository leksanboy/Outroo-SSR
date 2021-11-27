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
	MatInputModule,
	MatMenuModule,
	MatChipsModule
} from '@angular/material';

import { PipesModule } from '../../../core/pipes/pipes.module';

import { ShowChatComponent } from './showChat.component';

const routes: Routes = [
	{
		path: '',
		component: ShowChatComponent
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
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule,
		MatInputModule,
		MatMenuModule,
		MatChipsModule
	],
	declarations: [
		ShowChatComponent
	],
	exports: [
		ShowChatComponent
	]
})
export class ShowChatModule {}
