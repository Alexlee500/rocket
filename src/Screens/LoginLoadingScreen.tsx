import React, { useEffect } from 'react';
import  {Text, View } from 'react-native';

import { useDispatch } from 'react-redux';
import { connect, send  } from '@giantmachines/redux-websocket';

import { getAccessFromRefresh , getUserPrincipalData} from '../Redux/features/tdaSlice'

export default function LoginLoadingScreen() {
    const dispatch = useDispatch();
    dispatch(getAccessFromRefresh());
    dispatch(connect(`wss://streamer-ws.tdameritrade.com/ws`))

    console.log('Loading');
    useEffect(() => {
        //dispatch(getUserPrincipalData())
    }, [])


    return (
        <View>
            <Text>LOADING</Text>
        </View>
    )
}