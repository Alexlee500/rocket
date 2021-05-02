import React, { useEffect, useState } from 'react';
import  {Text, View, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';


import { selectWatchlist } from '../Redux/features/tdaSlice';

import { quoteSelector } from '../Redux/features/quoteSlice';

export default function WatchlistScreen() {
    const [selectedWatchlist, setSelectedWatchlist] = useState();

    const allQuotes = useSelector(quoteSelector.selectAll);

    console.log(`selectAll ${JSON.stringify(allQuotes)}`)

    const allEntities = useSelector(quoteSelector.selectEntities);
    console.log(`selectEnts ${JSON.stringify(allEntities)}`)


    console.log(`${JSON.stringify(allEntities.AAPL["1"])}`)


    const watchlists:Watchlists = useSelector( selectWatchlist )
    let myLists = watchlists.map((myValue, myIndex) => {
        return (
            <Picker.Item label={myValue.name} value={myIndex} key={myIndex}/>
        )
    })
    return(
        <View>
            <Picker
                selectedValue={selectedWatchlist}
                onValueChange={(itemValue, itemIndex) =>
                setSelectedWatchlist(itemValue)}
                mode="dropdown"
                >
                {myLists}
            </Picker>
            <Text>{JSON.stringify(watchlists[selectedWatchlist])}</Text>
            
        </View>
    )
}