import React, { useState, useEffect, useContext } from 'react';
import { TextInput, Card, Modal } from 'react-materialize';
import styled from 'styled-components';

import { ConnectionContext } from '../Connection';

const Wrapper = styled.div`
    padding: 30px;
    color: white;
    background-color: black;

    .active {
        color: #ffe500 !important;
    }

    input {
        color: white;
        border-color: #ffe500 !important;
    }
`;

const Name = styled.span`
    color: ${props => (props.isMe ? 'red' : 'white')};
`;

function Draft(props) {
    const context = useContext(ConnectionContext);
    const [name, setName] = useState('');
    const [isNameSet, setIsNameSet] = useState(false);
    const [players, setPlayers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [pack, setPack] = useState(null);
    const [hand, setHand] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem(props.id);
        if (userId) {
            setUserId(userId);
            setIsNameSet(true);
            context.invoke('ConnectToPlayer', props.id, userId);
        }
    }, [props.id]);

    useEffect(() => {
        const player = players.find(x => x.id === userId);
        if (!player) return;

        setHand(player.hand);
    }, [players]);

    context.on('ReceiveUserId', id => {
        setUserId(id);
        localStorage.setItem(props.id, id);
    });
    context.on('ReceivePlayers', players => setPlayers(players));
    context.on('ReceivePack', pack => setPack(pack));

    function addCardToHand(card) {
        setHand([...hand, card]);
        setPack();
        context.invoke('PickCard', userId, pack.id, card);
    }

    if (!isNameSet) {
        return (
            <Wrapper style={{ display: 'flex' }}>
                <TextInput
                    label="Nickname"
                    onChange={e => setName(e.currentTarget.value)}
                    value={name}
                />
                <button
                    style={{ marginLeft: '15px' }}
                    onClick={() => {
                        context.invoke('Join', props.id, name);
                        setIsNameSet(true);
                    }}
                >
                    Submit Name
                </button>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
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
                                    {card.name}
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
                        return <div>{card.name}</div>;
                    })}
                </div>
            </div>
        </Wrapper>
    );
}

export default Draft;
