import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import styled from 'styled-components';

import { ConnectionContext } from './Connection';
import GlobalStateProvider from './Contexts/GlobalStateProvider';
import Home from './Views/Home';
import CreateDraft from './Views/CreateDraft';
import DraftView from './Views/Draft';

const Name = styled.span`
    color: ${props => (props.isMe ? 'red' : 'black')};
`;

const FullScreen = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: black;
`;

function Draft({ match }) {
    let id = match.params.id;
    return <DraftView id={id} />;
}

function App() {
    return (
        <GlobalStateProvider>
            <FullScreen>
                <Switch>
                    <Route path="/create" component={CreateDraft} />
                    <Route path="/draft/:id" component={Draft} />
                    <Route path="/draft" component={DraftView} />
                    <Route path="/" component={Home} />
                </Switch>
            </FullScreen>
        </GlobalStateProvider>
    );

    const context = useContext(ConnectionContext);
    const [name, SetName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isNameSet, setIsNameSet] = useState(false);
    const [players, setPlayers] = useState([]);
    const [pack, setPack] = useState(null);
    const [hand, setHand] = useState([]);

    useEffect(() => {
        if (!isNameSet) return;
        context.invoke('Join', name);
    }, [isNameSet]);

    context.on('ReceivePlayers', players => setPlayers(players));
    context.on('ReceiveUserId', id => setUserId(id));
    context.on('ReceivePack', pack => setPack(pack));

    function deal() {
        context.invoke('DealPacks');
    }

    function addCardToHand(card) {
        setHand([...hand, card]);
        setPack();
        context.invoke('PickCard', userId, pack.id, card);
    }

    if (!isNameSet)
        return (
            <div>
                <input
                    type="text"
                    value={name ? name : ''}
                    onChange={e => SetName(e.target.value)}
                />
                <button onClick={() => setIsNameSet(true)}>Join!</button>
            </div>
        );

    return (
        <div>
            <button onClick={() => deal()}>Deal!</button>
            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '15px' }}>
                    {players.map(player => {
                        return (
                            <div>
                                <Name isMe={player.id === userId}>
                                    {player.name}
                                </Name>
                                <span>- picked {player.hand.length} cards</span>
                            </div>
                        );
                    })}
                </div>
                <div style={{ marginRight: '15px' }}>
                    Pack:
                    {pack ? (
                        pack.cards.map((card, index) => {
                            return (
                                // prettier-ignore
                                <div key={index} onClick={() => addCardToHand(card)}>
                                    {card}
                                </div>
                            );
                        })
                    ) : (
                        <div>Waiting for a pack</div>
                    )}
                </div>
                <div>
                    Hand:
                    {hand.map((card, index) => {
                        return <div>{card}</div>;
                    })}
                </div>
            </div>
        </div>
    );
}

export default App;
