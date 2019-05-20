import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

const VerticalCenter = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const HorizontalCenter = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: auto;
    margin-right: auto;
`;

const Button = styled.div`
    background-color: #ffda05;
    border-radius: 5px;
    font-weight: 600;
    margin-right: 10px;
    padding: 15px;

    cursor: pointer;

    :hover {
        background-color: #807300;
    }

    a {
        color: black;
        text-decoration: none;
    }
`;

function Home(props) {
    return (
        <VerticalCenter>
            <HorizontalCenter>
                <Button>
                    <Link to="/create">Create Draft</Link>
                </Button>
                <Button>
                    <Link to="/draft">Join Draft</Link>
                </Button>
            </HorizontalCenter>
        </VerticalCenter>
    );
}

export default Home;
