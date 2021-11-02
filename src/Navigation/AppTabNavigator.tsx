import React, {useEffect, useRef, useState} from 'react';
import { AppState, LogBox } from "react-native";
import { useDispatch, useSelector } from 'react-redux';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectUserPrincipals, resetConnections } from '../Redux/features/tdaSlice';
import { deauthenticate } from '../Redux/features/authSlice';
import { send, disconnect } from '@alexlee500/redux-websocket'
import { LogoutRequest } from '../api/AmeritradeSockRequests';

import AccountScreen from '../Screens/AccountScreen';
import WatchlistScreen from '../Screens/WatchlistScreen';
import QuoteScreen from '../Screens/QuoteScreen';
import UseIdleTimer from '../Components/IdleTimer/IdleTimer'

import Colors from '../configs/Colors'

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
const idleTimeout = 300000
const backgroundTimeout = 60000
export default function AppTabNavigator() {


    const PrincipalData = useSelector( selectUserPrincipals )
    const dispatch = useDispatch();

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);


    
    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange)
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange)
        }
    }, [])

    
    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
          ) {
            console.log("App has come to the foreground!");
          }
      
          appState.current = nextAppState;
          setAppStateVisible(appState.current);
          console.log("AppState", appState.current);
    }

    const onIdle = () => {
        const logout = async() => {
            console.log('logout')
            await dispatch(deauthenticate())
            await dispatch(send(LogoutRequest(PrincipalData)));
            await dispatch(disconnect());
            await dispatch(resetConnections());
        }
        logout();
    }

    return (
        <UseIdleTimer idleTimeout={idleTimeout} onIdleAction={() => onIdle()}>
            <Stack.Navigator
                headerMode="none"
                screenOptions={{animationEnabled:false}}
            >
            <Stack.Screen
                name="Tabs"
                component={ tabScreens }
                options={{animationEnabled:false}}
            />
            <Stack.Screen
                name="Quote"
                component={QuoteScreen}
                initialParams={{symbol:''}}
                options={{animationEnabled:false}}
                />        
            </Stack.Navigator>
        </UseIdleTimer>
    )

}

function tabScreens(){
    return (

            <Tab.Navigator 
                barStyle={{backgroundColor: Colors.SecondaryDark}}> 
                <Tab.Screen 
                    name="Watchlist" 
                    component={WatchlistScreen}
                    options={{
                        
                        tabBarIcon: () => (
                            <MaterialCommunityIcons name="playlist-star" color={Colors.TextLight} size={26}/> )
                    }}
                />
                <Tab.Screen 
                    name="Account" 
                    component={AccountScreen} 
                    options={{
                        tabBarIcon: () => (
                            <MaterialCommunityIcons name="account" color={Colors.TextLight} size={26}/> )
                    }}
                />
            </Tab.Navigator>
            
    )
}