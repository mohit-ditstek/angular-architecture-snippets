import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';
import { SocketEvents } from 'src/app/features/enums/message.enum';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {
  }

  public onGetEvent(eventName: SocketEvents) {
    return this.socket
      .fromEvent(eventName)
      .pipe(map((data: any) => data));
  }

  public emitEvent(eventName: SocketEvents, message: any) {
    this.socket.emit(eventName, message);
  }

}
