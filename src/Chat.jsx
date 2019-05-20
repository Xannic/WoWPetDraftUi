import React, { Component } from 'react';
import {
    HubConnectionBuilder,
    LogLevel,
    HttpTransportType
} from '@aspnet/signalr';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nick: '',
            message: '',
            messages: [],
            packs: [],
            hubConnection: null
        };
    }

    componentDidMount = () => {
        const nick = 'Xander';

        const hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl('http://localhost:57197/chatHub', {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();

        this.setState({ hubConnection, nick }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err =>
                    console.log('Error while establishing connection :(')
                );

            this.state.hubConnection.on(
                'ReceiveMessage',
                (nick, receivedMessage) => {
                    const text = `${nick}: ${receivedMessage}`;
                    const messages = this.state.messages.concat([text]);
                    this.setState({ messages });
                }
            );
            this.state.hubConnection.on('ReceivePacks', packs => {
                this.setState({ packs: packs });
            });
        });
    };

    sendMessage = () => {
        this.state.hubConnection
            .invoke('SendMessage', this.state.nick, this.state.message)
            .catch(err => console.error(err));

        this.setState({ message: '' });
    };

    setPacks = () => {
        this.state.hubConnection
            .invoke('SetPacks', [1, 2, 3, 4, 5, 6, 7, 8])
            .catch(err => console.error(err));
    };

    dealPacks = () => {
        this.state.hubConnection
            .invoke('DealPacks')
            .catch(err => console.error(err));
    };

    render() {
        return (
            <div>
                <button onClick={this.setPacks}>SetPacks</button>
                <button onClick={this.dealPacks}>DealPacks</button>
                <div>{this.state.packs.map(x => x)}</div>
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
                        <span style={{ display: 'block' }} key={index}>
                            {' '}
                            {message}{' '}
                        </span>
                    ))}
                </div>
            </div>
        );
    }
}

export default Chat;
