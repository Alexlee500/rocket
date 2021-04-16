import React, { useEffect } from 'react';
import  {Text, View } from 'react-native';

import { useDispatch } from 'react-redux';

import { getAccessFromStoredRefresh } from '../Redux/features/tdaSlice'

export default function LoginLoadingScreen() {
    const dispatch = useDispatch();
    console.log('Loading');
    dispatch(getAccessFromStoredRefresh());

    return (
        <View>
            <Text>LOADING</Text>
        </View>
    )
}