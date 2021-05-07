import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AccountScreen from '../Screens/AccountScreen';
import WatchlistScreen from '../Screens/WatchlistScreen';

import Colors from '../configs/Colors'

const Tab = createMaterialBottomTabNavigator();

export default function AppTabNavigator() {
    return (
        <Tab.Navigator barStyle={{backgroundColor: Colors.SecondaryDark}}> 
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