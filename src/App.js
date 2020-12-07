import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PollCreate from './views/PollCreate';
import PollRespond from './views/PollRespond';
import PollResults from './views/PollResults';
import { SplashHeader, SplashContainer } from './components/SplashUtils';

export default function App() {
    return (
        <SplashContainer>
            <SplashHeader />
            <Switch>
                <Route exact path="/">
                    <PollCreate />
                </Route>
                <Route exact path="/:id">
                    <PollRespond />
                </Route>
                <Route exact path="/:id/r">
                    <PollResults />
                </Route>
                <Route path="*">
                    <code>404: no match for route</code>
                </Route>
            </Switch>
        </SplashContainer>
    );
}
