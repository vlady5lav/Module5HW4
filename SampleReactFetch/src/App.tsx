import React, { ReactElement } from 'react';
import { Container } from 'react-bootstrap';

import AuthComponent from './AuthComponent';
import ResourceComponent from './ResourceComponent';
import UserComponent from './UserComponent';

const App = (): ReactElement => {
    return (
        <Container className="app">
            <h1 className="centered"><strong className="bordered"> UserComponent </strong></h1>
            <UserComponent />
            <h1 className="centered"><strong className="bordered"> ResourceComponent </strong></h1>
            <ResourceComponent />
            <h1 className="centered"><strong className="bordered"> AuthComponent </strong></h1>
            <AuthComponent />
        </Container>
    );
}

export default App;
