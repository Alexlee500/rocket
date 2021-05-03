import React from 'react';
import {Text, View, Button} from 'react-native';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import store from './Redux/store';
import AuthSelectionScreen from './Screens/AuthSelectionScreen';
import RootNavigationContainer from './Navigation/RootNavigationContainer';

const App = () => {
    return (
        <Provider store={store}>
        <PaperProvider>
            <RootNavigationContainer />
        </PaperProvider>
        </Provider>
    )
}


export default App;