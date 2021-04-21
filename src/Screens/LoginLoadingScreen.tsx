import React, { useEffect } from 'react';
import  {Text, View } from 'react-native';

import { useDispatch, useSelector} from 'react-redux';
import { connect, send  } from '@giantmachines/redux-websocket';
//import { connect, send } from '../Redux/middleware/WebsockMiddleware'

import { getAccessFromRefresh , getUserPrincipalData, selectUserPrincipals, buildWebSockConnection} from '../Redux/features/tdaSlice'

export default function LoginLoadingScreen() {
    const dispatch = useDispatch();

    /*
    const PrincipalData = useSelector( selectUserPrincipals )

    async function onStart (){
        awaitDispatch()
        .then(()=>{
            console.log(PrincipalData.streamerInfo.streamerSocketUrl)
            dispatch(connect(`wss://${PrincipalData.streamerInfo.streamerSocketUrl}.com/ws`))
        })
    }

    const awaitDispatch = async() => {
        console.log('await dispatch')
        await dispatch(getAccessFromRefresh());
        await dispatch(getUserPrincipalData());
        console.log('dispatch done')

    }
*/
    //const PrincipalData = useSelector( selectUserPrincipals )

    useEffect(() => {
        //dispatch(connect(`wss://streamer-ws.tdameritrade.com/ws`))
        //dispatch(buildWebSockConnection())
        //dispatch(getUserPrincipalData());
        dispatch(getAccessFromRefresh());

        dispatch(connect('wss://streamer-ws.tdameritrade.com/ws'))

    }, [])
    
    //dispatch(getAccessFromRefresh())
    //dispatch(getUserPrincipalData())
    //dispatch(connect('wss://streamer-ws.tdameritrade.com.com/ws'))

    //dispatch(connect(`wss://streamer-ws.tdameritrade.com/ws`))
    //dispatch(buildWebSockConnection())

    return (
        <View>
            <Text>LOADING</Text>
        </View>
    )
}