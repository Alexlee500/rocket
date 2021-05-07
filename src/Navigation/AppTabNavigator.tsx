import React, { useEffect } from 'react';
import  {Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import AccountScreen from '../Screens/AccountScreen';
import WatchlistScreen from '../Screens/WatchlistScreen';

import Colors from '../configs/Colors'

const Tab = createMaterialBottomTabNavigator();

export default function AppTabNavigator() {
    return (
        <Tab.Navigator barStyle={{backgroundColor: Colors.SecondaryDark}}> 
            <Tab.Screen name="Watchlist" component={WatchlistScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    )

}