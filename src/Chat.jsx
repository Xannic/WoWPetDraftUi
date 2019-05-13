import React, { Component } from 'react';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@aspnet/signalr';

class Chat extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      nick: '',
      message: '',
      messages: [],
      hubConnection: null,
    };
  }

  componentDidMount = () => {
    const nick = "Xander";

    const hubConnection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Debug)
    .withUrl("http://localhost:57197/chatHub", {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    })
    .build();

    this.setState({ hubConnection, nick }, () => {
      this.state.hubConnection
        .start()
        .then(() => console.log('Connection started!'))
        .catch(err => console.log('Error while establishing connection :('));

      this.state.hubConnection.on('ReceiveMessage', (nick, receivedMessage) => {
        const text = `${nick}: ${receivedMessage}`;
        const messages = this.state.messages.concat([text]);
        this.setState({ messages });
      });
    });
  }

  sendMessage = () => {
    this.state.hubConnection
      .invoke('SendMessage', this.state.nick, this.state.message)
      .catch(err => console.error(err));
  
      this.setState({message: ''});      
  };
  
  render() {
  return (
    <div>
      <input
        type="text"
        value={this.state.nick}
        onChange={e => this.setState({ nick: e.target.value })}
      />
      <br />
      <input
        type="text"
        value={this.state.message}
        onChange={e => this.setState({ message: e.target.value })}
      />
        <br />
      <button onClick={this.sendMessage}>Send</button>

      <div>
        {this.state.messages.map((message, index) => (
          <span style={{display: 'block'}} key={index}> {message} </span>
        ))}
      </div>
    </div>
  );
}
}

export default Chat;