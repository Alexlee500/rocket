import React from 'react';
import {Text, View, Button} from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';


import store from './Redux/store';
import AuthSelectionScreen from './Screens/AuthSelectionScreen';
import RootNavigationContainer from './Navigation/RootNavigationContainer';

const App = () => {
    return (
        <Provider store={store}>
            <RootNavigationContainer />
        </Provider>
    )
}


export default App;