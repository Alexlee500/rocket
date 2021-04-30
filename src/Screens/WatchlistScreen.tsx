import React, { useEffect } from 'react';
import  {Text, View, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';


import { selectWatchlist } from '../Redux/features/tdaSlice';

export default function WatchlistScreen() {

    const watchlist:Watchlists = useSelector( selectWatchlist )
    console.log(watchlist)
    return(
        <View>
            <Text>Watchlist</Text>
        </View>
    )
}