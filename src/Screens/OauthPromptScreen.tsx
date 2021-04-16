import React, {useEffect, useState} from 'react';
import  {Text, View, Button } from 'react-native';
import * as tda from '../api/AmeritradeApi';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../Redux/rootReducer';
import { getTokensFromOauth, getRefreshFromStorage} from '../Redux/features/tdaSlice';

export default function OauthPromptScreen() {
    const dispatch = useDispatch();
    useSelector( (state: RootState) => state.tda.accessToken )
    useSelector( (state: RootState) => state.tda.refreshToken )

    console.log('Oauth promot Screen');
    
    let tdaLogin = async() => {
        console.log('TDA Login');
        dispatch(getTokensFromOauth());
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