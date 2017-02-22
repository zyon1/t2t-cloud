import * as firebase from 'firebase';
export class Message{
    senderID: string;
    senderName: string;
    senderSurname:string;
    timestamp: any = firebase.database['ServerValue']['TIMESTAMP'];
    // timestamp:number; get server time
    seen?: string[];//store id-s
    recieved? :string[];
    text: string;
    constructor(senderID, senderName, senderSurname, text, recieved?, seen?, timestamp?){
        this.senderID=senderID;
        this.senderName=senderName;
        this.senderSurname=senderSurname;
        this.text=text;
        this.timestamp=timestamp?timestamp:this.timestamp;
        this.seen=seen?seen:null;
        this.recieved=recieved?recieved:null;
    }
}
export class GroupMessage{
    senderID: string;
    senderName: string;
    senderSurname:string;
    timestamp: any = firebase.database['ServerValue']['TIMESTAMP'];
    // get server time
    seen?: boolean;
    recieved?: boolean;
    text: string;
    constructor(senderID, senderName, senderSurname, text, recieved?, seen?, timestamp?){
        this.senderID=senderID;
        this.senderName=senderName;
        this.senderSurname=senderSurname;
        this.text=text;
        this.timestamp=timestamp?timestamp:this.timestamp;
        this.seen=seen?seen:null;
        this.recieved=recieved?recieved:null;
    }
}