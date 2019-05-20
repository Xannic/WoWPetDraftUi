import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { TextInput, Card, Modal } from 'react-materialize';

import { ConnectionContext } from '../Connection';
import AddPet from './AddPet';

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

const AddButton = styled.div`
    background-color: #ffda05;
    border-radius: 5px;
    font-weight: 600;
    margin-right: 10px;
    padding: 15px;
    text-align: center;

    :hover {
        background-color: #807300;
    }
`;

function CreateDraft(props) {
    const context = useContext(ConnectionContext);
    const [showPopup, setShowPopup] = useState(false);
    const [addIndex, setAddIndex] = useState(null);
    const [name, setName] = useState('');
    const [worldId, setWorldId] = useState(null);

    const [packs, setPacks] = useState([]);

    function addPetToPack(pet) {
        const newPacks = [...packs];
        newPacks[addIndex].cards = newPacks[addIndex].cards.concat([pet]);
        setPacks(newPacks);
    }

    function removePetFromPack(packIndex, petIndex) {
        const newPacks = [...packs];
        newPacks[packIndex].cards.splice(petIndex, 1);
        setPacks(newPacks);
    }

    function removePack(index) {
        const newPacks = [...packs];
        newPacks.splice(index, 1);
        setPacks(newPacks);
    }

    function renderAddView(index) {
        return (
            <AddPet
                onAdd={pet => {
                    addPetToPack(pet);
                    setShowPopup(false);
                }}
            />
        );
    }

    context.on('ReceiveWorld', id => setWorldId(id));

    return (
        <Wrapper>
            {showPopup ? renderAddView() : null}
            <div style={{ maxWidth: '400px' }}>
                <TextInput
                    label="Draft Name"
                    onChange={e => setName(e.currentTarget.value)}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                {packs.map((pack, index) => {
                    return (
                        <div
                            key={index}
                            style={{ display: 'flex', marginBottom: '15px' }}
                        >
                            <AddButton onClick={() => removePack(index)}>
                                remove Pack
                            </AddButton>
                            <AddButton
                                onClick={() => {
                                    setShowPopup(true);
                                    setAddIndex(index);
                                }}
                            >
                                Add card
                            </AddButton>
                            {pack.cards.map((card, cardIndex) => {
                                return (
                                    <Card
                                        key={card.creatureId}
                                        className="blue-grey darken-1"
                                        textClassName="white-text"
                                        title={card.name}
                                    >
                                        <button
                                            onClick={() =>
                                                removePetFromPack(
                                                    index,
                                                    cardIndex
                                                )
                                            }
                                        >
                                            delete
                                        </button>
                                    </Card>
                                );
                            })}
                        </div>
                    );
                })}
                <AddButton
                    onClick={() => setPacks(packs.concat([{ cards: [] }]))}
                >
                    Add pack
                </AddButton>
            </div>

            <AddButton
                onClick={() => {
                    context.invoke('CreateWorld', name, packs);
                }}
            >
                Publish Draft
            </AddButton>

            <Modal
                header={`Link to join ${name}`}
                open={worldId ? true : false}
                options={{ onCloseEnd: () => setWorldId(null) }}
            >
                {/* prettier-ignore */}
                <span style={{ userSelect: 'all' }}>{`${window.location.origin}/draft/${worldId}`}</span>
            </Modal>
        </Wrapper>
    );
}

export default CreateDraft;
