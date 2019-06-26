import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  messages: Array<any>;
  chatbox: string;
  socketSubscription: Subscription;

  constructor(private socket: SocketService) {
    this.messages = [];
    this.chatbox = "";
  }

  ngOnInit() {
    this.socketSubscription = this.socket.getEventListener().subscribe(event => {
      switch (event.type) {
        case "message":
          let data = event.data.content;
          if (event.data.sender) {
            data = `${event.data.sender}:data`;
          }
          this.messages.push(data);
          break;

        case "close":
          this.messages.push("/The socket connection has been closed.");
          break;

        case "open":
          this.messages.push("/The socket connection has been established.");
          break;

        default:
          break;
      }
    });
  }

  ngOnDestroy() {
    this.socket.close();
    this.socketSubscription.unsubscribe();
  }

  public send() {
    if (this.chatbox) {
      this.socket.send(this.chatbox);
    }
    this.chatbox = "";
  }

  public isSystemMessage(message: string) {
    return message.startsWith("/") ? `<strong>${message.substring(1)}</strong>` : message;
  }
}
