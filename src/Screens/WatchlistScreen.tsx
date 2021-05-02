import React, { useEffect, useState } from 'react';
import  {Text, View, Button, FlatList, SafeAreaView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem } from "react-native-elements"

import { selectWatchlist } from '../Redux/features/tdaSlice';

import { quoteSelector } from '../Redux/features/quoteSlice';

export default function WatchlistScreen() {
    const [selectedWatchlist, setSelectedWatchlist] = useState();

    const allEntities = useSelector(quoteSelector.selectEntities);

    useEffect(() => {
        console.log(`selectEnts ${JSON.stringify(allEntities)}`)
    }, [allEntities])

    const watchlists:Watchlists = useSelector( selectWatchlist )
    let myLists = watchlists.map((myValue, myIndex) => {
        return (
            <Picker.Item label={myValue.name} value={myIndex} key={myIndex}/>
        )
    })


    return(
        <SafeAreaView>
        <View>
            <Picker
                selectedValue={selectedWatchlist}
                onValueChange={(itemValue, itemIndex) =>
                setSelectedWatchlist(itemValue)}
                mode="dropdown"
                >
                {myLists}
            </Picker>
            <FlatList
                data={watchlists[selectedWatchlist]?.watchlistItems}
                keyExtractor={item => item.instrument.symbol}
                renderItem={({item}) => (
                    <Text>{item.instrument.symbol} {(allEntities?.[item.instrument.symbol]?.['1'] || '-')}</Text>

                )}
            />
            
            
        </View>
        </SafeAreaView>
    )
}