import React, { ReactElement, Suspense } from 'react';
import { Container } from 'react-bootstrap';
import { LoadingGenerator } from './components/ListComponent'

const UserComponent = React.lazy(() => import('./components/UserComponent'))
const ResourceComponent = React.lazy(() => import('./components/ResourceComponent'))
const AuthComponent = React.lazy(() => import('./components/AuthComponent'))

const App = (): ReactElement => {
    return (
        <Suspense fallback={<LoadingGenerator />}>
            <Container className="app">
                <h1 className="centered"><strong className="bordered"> UserComponent </strong></h1>
                <UserComponent />
                <h1 className="centered"><strong className="bordered"> ResourceComponent </strong></h1>
                <ResourceComponent />
                <h1 className="centered"><strong className="bordered"> AuthComponent </strong></h1>
                <AuthComponent />
            </Container>
        </Suspense>
    );
}

export default App;
