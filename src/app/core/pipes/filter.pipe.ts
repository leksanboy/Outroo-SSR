import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], key: any, value: any): any {
        console.log('items:', items);
        console.log('key:', key);
        console.log('value:', value);

        if (!items || !key) {
            return items;
        }

        return items.filter(item => item[key] ? (item[key].indexOf(value) !== -1) : false);
    }
}
