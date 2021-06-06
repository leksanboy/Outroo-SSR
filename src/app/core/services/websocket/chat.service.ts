import { Injectable } from '@angular/core';
import { Subscriber, Observable } from 'rxjs';

import { WebsocketService } from './websocket.service';

@Injectable()
export class ChatsocketService {
	constructor(
		private webSocket: WebsocketService
	) {
		// let ws = new WebSocket('wss://ltughuckuc.execute-api.eu-west-1.amazonaws.com/beta');
		// ws.onmessage = (ev: any) => {
		// 	// log.(ev)
		// };
	}

	// watchProduct(productId: number): Observable<any> {
	// 	let openSubscriber = Subscriber.create(
	// 		() => this.webSocket.send({productId: productId}));

	// 	return this.webSocket.createObservableSocket('wss://beatfeel.com/assets/api/socket_test.php?productId=1', openSubscriber)
	// 		.map(message => {
	// 			// JSON.parse(message);
	// 		});
	// }
}
