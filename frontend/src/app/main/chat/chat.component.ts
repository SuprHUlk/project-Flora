import { Component } from '@angular/core';
import { ProfileService } from 'src/services/profile.service';
import { Friend } from 'src/models/user.model';
import { ChatService } from 'src/services/chat.service';
import { ChatRequest, ChatResponse } from 'src/models/chat.model';
import { ToastService } from 'src/services/shared/toast.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: false,
})
export class ChatComponent {
  constructor(
    private profileService: ProfileService,
    private chatService: ChatService,
    private toastService: ToastService
  ) {}

  msg: string;

  currentUser: Friend;

  img: string;

  showTextField: boolean = false;

  friends: Friend[] = [];

  loader: boolean = true;

  chat: ChatResponse[] = [];

  ngOnInit() {
    this.getFriends();
    this.getMessages();
  }

  // getProfile() {
  //   this.profileService.get().subscribe({
  //     next: (res) => {
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => {},
  //   });
  // }

  getFriends() {
    this.profileService.getFriends().subscribe({
      next: (res: Friend[]) => {
        this.friends = res;
        console.log(this.friends);
      },
      error: (err) => {
        this.toastService.error({
          message: 'Error occurred: Please try again later.',
          autohide: true,
        });
        console.log(err);
      },
      complete: () => {
        this.loader = false;
      },
    });
  }

  getMessages() {
    this.chatService.getMessages$().subscribe((res) => {
      console.log(res);
      this.chat = res;
    });
  }

  onContactClick(friend: Friend) {
    this.showTextField = true;
    this.chatService.get(friend._id);
    this.currentUser = friend;
  }

  send() {
    if (this.msg.trim()) {
      const chat: ChatRequest = {
        message: this.msg,
        receiver: this.currentUser._id,
      };
      this.chatService.send(chat);
      this.msg = '';
    }
  }

  // TODO: Delete friend
  deletechat() {
    // console.log(this.currentuser);
    // this.afs.doc(`users/${this.em}/Friends/${this.currentuser}`).delete();
    // this.afs.doc(`users/${this.currentuser}/Friends/${this.em}`).delete();
  }
}
