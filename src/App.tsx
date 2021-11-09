import React from 'react';
import {Text, View, Button, SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import { Provider } from 'react-redux';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import store from './Redux/store';
import AuthSelectionScreen from './Screens/AuthSelectionScreen';
import RootNavigationContainer from './Navigation/RootNavigationContainer';
import Colors from './configs/Colors'

const App = () => {
    
    return (
        <Provider store={store}>
        <StatusBar backgroundColor="black" />
            <RootNavigationContainer />
        </Provider>
    )    
}


const theme = {
    ...DarkTheme,
    colors:{
        text: Colors.TextLight
    }
}

export default App;