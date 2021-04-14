import React, { useEffect } from 'react';
import  {Text, View } from 'react-native';

import { useDispatch } from 'react-redux';

import { getTokens } from '../Redux/features/tdaSlice';

export default function LoginLoadingScreen() {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Loading');
        dispatch(getTokens(false));
    }, []);

    return (
        <View>
            <Text>LOADING</Text>
        </View>
    )
}