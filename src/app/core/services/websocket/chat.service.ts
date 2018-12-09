import { Injectable } from '@angular/core';
import { Subscriber, Observable } from 'rxjs';

import { WebsocketService } from './websocket.service';

@Injectable()
export class ChatsocketService {
	constructor(
		private webSocket: WebsocketService
	) {}

	// watchProduct(productId: number): Observable<any> {
	// 	let openSubscriber = Subscriber.create(
	// 		() => this.webSocket.send({productId: productId}));

	// 	return this.webSocket.createObservableSocket('wss://outhroo.com/assets/api/socket_test.php?productId=1', openSubscriber)
	// 		.map(message => {
	// 			// JSON.parse(message);
	// 		});
	// }
}