import React, { useEffect } from 'react';
import  {Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AccountScreen from '../Screens/AccountScreen';
import WatchlistScreen from '../Screens/WatchlistScreen';

const Tab = createBottomTabNavigator();

export default function AppTabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Watchlist" component={WatchlistScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    )

}