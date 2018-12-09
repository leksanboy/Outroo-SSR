import { NgModule } from '@angular/core';

import { TimeagoPipe } from './timeago.pipe';
import { SafeHtmlPipe } from './safehtml.pipe';
import { DateTimePipe } from './datetime.pipe';
import { ReversePipe } from './reverse.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
	declarations: [
		TimeagoPipe,
		SafeHtmlPipe,
		DateTimePipe,
		ReversePipe,
		TruncatePipe
	],
	exports: [
		TimeagoPipe,
		SafeHtmlPipe,
		DateTimePipe,
		ReversePipe,
		TruncatePipe
	]
})
export class PipesModule { }
