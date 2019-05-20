import React, { useState, useEffect } from 'react';
import {
    HubConnectionBuilder,
    LogLevel,
    HttpTransportType
} from '@aspnet/signalr';

import Loadscreen from './components/Loadscreen';

export const ConnectionContext = React.createContext({});

function ConnectionProvider(props) {
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl('http://localhost:57197/chatHub', {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();

        setConnection(connection);

        connection
            .start()
            .then(() => setIsConnected(true))
            .catch(error => console.log(error));
    }, []);

    if (!isConnected) {
        return <Loadscreen />;
    }

    return (
        <ConnectionContext.Provider value={connection}>
            {props.children}
        </ConnectionContext.Provider>
    );
}

export default ConnectionProvider;
