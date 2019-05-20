import React, { useEffect, useState, useContext } from 'react';
import { ConnectionContext } from '../Connection';
export const GlobalStateContext = React.createContext({});

function GlobalStateProvider(props) {
    const context = useContext(ConnectionContext);
    const [state, setState] = useState(null);
    const [pets, setPets] = useState(null);
    useEffect(() => {
        context.invoke('GetPets');
    }, []);

    useEffect(() => {
        setState({ pets: pets });
    }, [pets]);

    context.on('ReceivePets', pets => setPets(pets));

    return (
        <GlobalStateContext.Provider value={state}>
            {props.children}
        </GlobalStateContext.Provider>
    );
}

export default GlobalStateProvider;
