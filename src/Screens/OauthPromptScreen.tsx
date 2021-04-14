import React, {useEffect, useState} from 'react';
import  {Text, View, Button } from 'react-native';
import * as tda from '../api/AmeritradeApi';
import { useDispatch, useSelector } from 'react-redux';

import { getTokens } from '../Redux/features/tdaSlice';

export default function OauthPromptScreen() {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Oauth Prompt Screen Load');
        dispatch(getTokens(false));

    }, []);

    let tdaLogin = async() => {
        console.log('TDA Login');
        dispatch(getTokens(true));
    }

    return (
        <View>
            <Text>Oauth Prompt Screen</Text>
            <Button 
                title="Log in With TD Ameritrade"
                onPress={() => tdaLogin()}
            />
        </View>
    )


}