import React, { ReactElement } from 'react';

import AuthComponent from './AuthComponent';
import ResourceComponent from './ResourceComponent';
import UserComponent from './UserComponent';

const App = (): ReactElement => {
    return (
        <>
            <UserComponent />
            <ResourceComponent />
            <AuthComponent />
        </>
    );
}

export default App;
