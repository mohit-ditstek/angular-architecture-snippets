import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../service/message.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { Message, User } from 'src/app/shared/models/message.model';
import { SocketEvents } from '../enums/message.enum';
import { switchMap, tap } from 'rxjs';
import { UnSubscriptionComponent } from 'src/app/shared/components/un-subscription/un-subscription.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent extends UnSubscriptionComponent {
  form: FormGroup;
  messages: Message[] = [];
  users: User[] = [];
  selectedUser!: User | null;
  selectedMessage!: Message | null;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private socketService: SocketService

  ) {
    super();
    this.form = this.formBuilder.group({
      message: ['']
    });
  }

  ngOnInit() {
    this.getSocketEvent();
    this.loadUsers();
  }

  public onSelectUser(user: User) {
    this.selectedUser = user;
    this.messages = user.messages || [];
    this.selectedMessage = null;
    this.isEditing = false;
  }

  public onSelectMessage(message: Message) {
    this.selectedMessage = this.selectedMessage === message ? null : message;
  }

  public onSubmit() {
    if (this.form.valid && this.selectedUser) {
      const messageData = {
        message: this.form.value.message,
        userId: this.selectedUser.id
      };
      this.isEditing ? this.updateMessage(messageData) : this.addMessage(messageData);
    }
  }

  public onEditMessage() {
    if (this.selectedMessage) {
      this.isEditing = true;
      this.form.patchValue({ message: this.selectedMessage.message });
    }
  }

  public onDeleteMessage() {
    if (this.selectedUser && this.selectedMessage) {
      this.subscription.add(this.messageService.getUsers().pipe(
        switchMap(users => this.deleteMessageFromUser(users))
      ).subscribe({
        next: (res) => {
          console.log('Message deleted successfully', res);
          this.socketService.emitEvent(SocketEvents.DeleteMessage, { id: this.selectedMessage?.id });
          this.selectedMessage = null;
        },
        error: error => {
          console.error('Error while delete message', error);
        }
      }))
    }
  }

  private getSocketEvent() {
    this.subscription.add(this.socketService.onGetEvent(SocketEvents.AddMessage).subscribe({
      next: message => {
        if (this.selectedUser && message.userId === this.selectedUser.id) {
          this.messages.push(message);
        }
      },
      error: error => {
        console.error('Error receiving added message', error);
      }
    }));

    this.subscription.add(this.socketService.onGetEvent(SocketEvents.EditMessage).subscribe({
      next: updatedMessage => {
        if (this.selectedUser) {
          this.messages = this.messages.map(msg =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        };
      },
      error: error => {
        console.error('Error receiving edited message', error);
      }
    }));

    this.subscription.add(this.socketService.onGetEvent(SocketEvents.DeleteMessage).subscribe({
      next: deletedMessage => {
        if (this.selectedUser) {
          this.messages = this.messages.filter(msg =>
            msg.id !== deletedMessage.id
          );
        }
      },
      error: error => {
        console.error('Error receiving deleted message', error);
      }
    }));
  }

  private loadUsers() {
    this.subscription.add(this.messageService.getUsers().subscribe({
      next: users => {
        this.users = users;
        // this.onSelectUser(this.selectedUser || this.users[0]);
      },
      error: error => {
        console.error('Error loading users', error);
      }
    }));
  }

  private addMessage(messageData: { message: string, userId: string }) {
    this.subscription.add(this.messageService.getUsers().pipe(
      switchMap(users => this.updateUserMessages(users, messageData, false))
    ).subscribe({
      next: () => {
        console.log('Message added successfully');
        this.socketService.emitEvent(SocketEvents.AddMessage, messageData);
        this.resetForm();
      },
      error: error => {
        console.error('Error while processing add message', error);
      }
    }));
  }

  private updateMessage(messageData: { message: string, userId: string }) {
    this.subscription.add(this.messageService.getUsers().pipe(
      switchMap(users => this.updateUserMessages(users, messageData, true))
    ).subscribe({
      next: () => {
        console.log('Message updated successfully');
        this.socketService.emitEvent(SocketEvents.EditMessage, { id: this.selectedMessage?.id, message: messageData.message });
        this.resetForm();
        this.onSelectUser(this.selectedUser || this.users[0]);
      },
      error: error => {
        console.error('Error while processing update message', error);
      }
    }))
  }

  private updateUserMessages(users: User[], messageData: { message: string, userId: string }, isUpdate: boolean) {
    const user = users.find(u => u.id === messageData.userId);
    if (user) {
      if (isUpdate) {
        const message = user.messages?.find(m => m.id === this.selectedMessage?.id);
        if (message) message.message = messageData.message;
      } else {
        user.messages = user.messages || [];
        user.messages.push({ id: this.generateUniqueMessageId(), message: messageData.message });
      }
      return this.messageService.updateUserData(user.id, user);
    } else {
      throw new Error('User not found');
    }
  }


  private deleteMessageFromUser(users: User[]) {
    const user = users.find(u => u.id === this.selectedUser?.id);
    if (user) {
      user.messages = user.messages?.filter(m => m.id !== this.selectedMessage?.id);
      return this.messageService.updateUserData(user.id, user);
    } else {
      throw new Error('User not found');
    }
  }

  private resetForm() {
    this.form.reset();
    this.isEditing = false;
  }

  private generateUniqueMessageId() {
    return Math.random().toString(36).substr(2, 5);
  }

}
