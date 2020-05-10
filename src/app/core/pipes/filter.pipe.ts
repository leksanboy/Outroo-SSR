import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], key: any, value: any): any {
        /* log('items:', items);
        log('key:', key);
        log('value:', value); */

        if (!items || !key) {
            return items;
        }

        return items.filter(item => item[key] ? (item[key].indexOf(value) !== -1) : false);
    }
}
