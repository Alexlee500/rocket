import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AccountScreen from '../Screens/AccountScreen';
import WatchlistScreen from '../Screens/WatchlistScreen';
import QuoteScreen from '../Screens/QuoteScreen';

import Colors from '../configs/Colors'

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export default function AppTabNavigator() {
    return (
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