import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
	MatButtonModule,
	MatDialogModule,
	MatProgressSpinnerModule
} from '@angular/material';

import { NewAvatarComponent } from './newAvatar.component';

const routes: Routes = [
	{
		path: '',
		component: NewAvatarComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatDialogModule,
		MatProgressSpinnerModule
	],
	declarations: [
		NewAvatarComponent
	],
	exports : [
		NewAvatarComponent
	]
})
export class NewAvatarModule {}
