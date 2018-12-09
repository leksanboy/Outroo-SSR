import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
	MatButtonModule,
	MatDialogModule
} from '@angular/material';

import { ShowAvatarComponent } from './showAvatar.component';

const routes: Routes = [
	{
		path: '',
		component: ShowAvatarComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatDialogModule
	],
	declarations: [
		ShowAvatarComponent
	],
	exports: [
		ShowAvatarComponent
	]
})
export class ShowAvatarModule {}
