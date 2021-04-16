import React from 'react';
import  {Text, View, Button } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import { useDispatch, useSelector } from 'react-redux';
import { clearTokens } from '../Redux/features/tdaSlice';
import { deauthenticate } from '../Redux/features/authSlice';
import { RootState } from '../Redux/rootReducer';

import * as tda from '../api/AmeritradeApi';


export default function DeAuthTestScreen(){
    console.log('DeAuthTestScreen')
    const dispatch = useDispatch();
    const fill = 'rgb(134, 65, 244)'
    const data = [50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80]

    
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