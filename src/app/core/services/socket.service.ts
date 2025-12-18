import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io('https://hiring-dev.internal.kloudspot.com', {
      transports: ['websocket'],
    });
  }
}
