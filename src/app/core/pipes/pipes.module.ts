import { NgModule } from '@angular/core';

import { TimeagoPipe } from './timeago.pipe';
import { SafeHtmlPipe } from './safehtml.pipe';
import { DateTimePipe } from './datetime.pipe';
import { TruncatePipe } from './truncate.pipe';
import { FilterPipe } from './filter.pipe';

@NgModule({
	declarations: [
		TimeagoPipe,
		SafeHtmlPipe,
		DateTimePipe,
		TruncatePipe,
		FilterPipe
	],
	exports: [
		TimeagoPipe,
		SafeHtmlPipe,
		DateTimePipe,
		TruncatePipe,
		FilterPipe
	]
})
export class PipesModule {}
