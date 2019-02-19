import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum AlertType {
    info,
    error,
    warning,
    success
}

export interface Message {
    body: string,
    type: AlertType,
    class?: string,
    timeout: number,
    timestamp?: number,
    clear?: Function
}

@Injectable()
export class NotificationService {
    private queueList: Message[] = [];
    public messagesSubject = new Subject<Message[]>();
    pop (message) {
        message.class = AlertType[message.type];
        message.timestamp = new Date().getTime();
        this.queueList.unshift(message);
        this.messagesSubject.next([...this.queueList]);
        message.clear(message)
    }
    push (message: Message) {
        message.class = AlertType[message.type];
        message.timestamp = new Date().getTime();
        message.clear = (self) => {
            setTimeout(() => {
                this.queueList = [
                    ...this.queueList.filter(msg => self.timestamp !== msg.timestamp)
                ]
                this.messagesSubject.next(this.queueList)
            }, self.timeout)
        }
        this.queueList.push(message)
        this.messagesSubject.next([...this.queueList]);
        message.clear(message)
    }
}