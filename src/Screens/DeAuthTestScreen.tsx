import React from 'react';
import  {Text, View, Button } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import { useDispatch, useSelector } from 'react-redux';
import { deauthenticate } from '../Redux/features/authSlice';
import { RootState } from '../Redux/rootReducer';

import * as tda from '../api/AmeritradeApi';


export default function DeAuthTestScreen(){
    
    const authenticated = useSelector( (state: RootState) => state.auth.authenticated )
    const dispatch = useDispatch();
    const fill = 'rgb(134, 65, 244)'
    const data = [50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80]

    
    let loginTest = async() => {
        console.log('Log in test');
        await tda.oauthApiLogin();
    }

    return(
        <>
        <BarChart style={{ height: 200 }} data={data} svg={{ fill }} contentInset={{ top: 30, bottom: 30 }}>
            <Grid />
        </BarChart>
        <Button   
            title="Log in with TDA"
            onPress={() => loginTest()} 
        />
        </>
    )

}