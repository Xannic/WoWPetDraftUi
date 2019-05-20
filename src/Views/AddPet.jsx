import React, { useState, useEffect, useContext } from 'react';
import { TextInput, Card } from 'react-materialize';

import { GlobalStateContext } from '../Contexts/GlobalStateProvider';

function AddPet(props) {
    const context = useContext(GlobalStateContext);
    const [search, setSearch] = useState('');
    const [pets, setPets] = useState(context.pets);

    useEffect(() => {
        // prettier-ignore
        setPets(context.pets.filter(x => x.name.toLowerCase().includes(search.toLowerCase())));
    }, [search, context.pets]);

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                background: 'black',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 999
            }}
        >
            <TextInput
                label="Pet name"
                value={search}
                onChange={value => setSearch(value.currentTarget.value)}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {pets.map(pet => {
                    return (
                        <Card
                            key={pet.creatureId}
                            className="blue-grey darken-1"
                            textClassName="white-text"
                            title={pet.name}
                            onClick={() => props.onAdd(pet)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default AddPet;
