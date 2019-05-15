import { NgModule } from '@angular/core';

import { TimeagoPipe } from './timeago.pipe';
import { SafeHtmlPipe } from './safehtml.pipe';
import { DateTimePipe } from './datetime.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
	declarations: [
		TimeagoPipe,
		SafeHtmlPipe,
		DateTimePipe,
		TruncatePipe
	],
	exports: [
		TimeagoPipe,
		SafeHtmlPipe,
		DateTimePipe,
		TruncatePipe
	]
})
export class PipesModule { }
