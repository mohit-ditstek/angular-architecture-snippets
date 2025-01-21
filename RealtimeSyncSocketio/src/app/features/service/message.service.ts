import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  User } from 'src/app/shared/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {
  }

  public getUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  public updateUserData(userId: string, user: User) {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, user);
  }

}

