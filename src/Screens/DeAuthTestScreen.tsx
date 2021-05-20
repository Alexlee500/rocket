import React, { useEffect } from 'react';
import  {Text, View, Button } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts'
//import { connect, send  } from '@giantmachines/redux-websocket';
import { connect, send } from '@alexlee500/redux-websocket/ReduxWebsocket'

import { parseISO } from 'date-fns'

import { useDispatch, useSelector } from 'react-redux';
import { clearTokens, selectUserPrincipals } from '../Redux/features/tdaSlice';
import { deauthenticate } from '../Redux/features/authSlice';
import { RootState } from '../Redux/rootReducer';
import { subscribeAccountActivity, subscribeQuote } from '../api/AmeritradeSockRequests';

import * as tda from '../api/AmeritradeApi';


export default function DeAuthTestScreen(){

    useEffect(() => {
        subsAccountActivity()
    }, [])

    console.log('DeAuthTestScreen')
    const PrincipalData = useSelector( selectUserPrincipals )

    const dispatch = useDispatch();
    const fill = 'rgb(134, 65, 244)'
    const data = [50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80]

    const subsAccountActivity = () => {

    }


    let logoutTest = async() => {
        console.log('out test');
        dispatch(clearTokens());
        dispatch(deauthenticate());
    }

    return(
        <>
        <BarChart style={{ height: 200 }} data={data} svg={{ fill }} contentInset={{ top: 30, bottom: 30 }}>
            <Grid />
        </BarChart>
        <Button   
            title="Log Out"
            onPress={() => logoutTest()}
        />
        </>
    )

}