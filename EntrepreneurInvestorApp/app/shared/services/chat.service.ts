import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../models/chat-message';
import * as moment  from 'moment'
import { DateUtils } from 'src/app/core/util/DateUtils';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;

  constructor(private authService: AuthenticationService, private httpService: HttpClient) { 
  }


  connect(ijid){
    this.socket = io(environment.chatApiUrl, {
      extraHeaders: {
        authorization: `Bearer ${this.authService.authorizationHeaderValue}`,
        ijid
      }
    })
  }

  sendMessage(message){
    this.socket.emit('chatmessage', message)
  }

  sendTypingStart() {
    this.socket.emit('typing-started')
  }

  sendTypingEnd() {
    this.socket.emit('typing-ended')
  }

  onConnect(): Observable<any>{
    return new Observable(observer => {
      this.socket.on('connect', () => {
        observer.next('');
      });
    });
  }

  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }

  onTypingStarted(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('typing-started', (userId) => {
        observer.next(userId);
      });
    });
  }

  onTypingEnd(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('typing-ended', (userId) => {
        observer.next(userId);
      });
    });
  }

  connectToRoom(){
    return this.socket.emit('room', {}, (res)=>{
    })
  }


  createNewMessage(msgString){
    const userProfileId = this.authService.getUserDetails().profileId
    return {
      message: msgString,
      createdBy: userProfileId,
      sentByMe: true,
      createdDate: new Date()
    }
  }

  mapMessage = (msg) => {
    const userProfileId = this.authService.getUserDetails().profileId
    return {
      ...msg,
      sentByMe: msg.createdBy === userProfileId,
      createdDate: msg.createdDate
    }
  }

  sortMessages = (messages:  Array<ChatMessage>) => {
    return messages.sort((m1, m2) => new Date(m2.createdDate).getTime() - new Date(m1.createdDate).getTime())
  }

  async getAllMessages(ijId, pageNumber): Promise<any> {
    return this.httpService.get(`${environment.chatApiUrl}/chatMessage/${ijId}?pageNumber=${pageNumber}`, {
      headers: {
        ijid: ijId
      }
    })
              .pipe(map(res =>  {
                const messages = res['messages']
                return {
                  results: this.sortMessages(messages['results'].map(this.mapMessage)),
                  total: messages['total']
                }
              }))
              .toPromise()
  }

  async deleteMessage(ijId, messageId) {
    return this.httpService.delete(`${environment.chatApiUrl}/chatMessage/${messageId}`, {
      headers: {
        ijid: ijId
      }
    }).toPromise()
  }

}
