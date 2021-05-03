import React, { useEffect, useState } from 'react';
import  {Text, View, Button, FlatList, SafeAreaView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { ListItem, Header } from "react-native-elements"
import { Appbar, Menu, Divider } from 'react-native-paper';

import { selectWatchlist } from '../Redux/features/tdaSlice';

import { quoteSelector } from '../Redux/features/quoteSlice';
import App from '../App';

export default function WatchlistScreen() {
    const [selectedWatchlist, setSelectedWatchlist] = useState();
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);


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

    let watchlistMenuItem = watchlists.map((myValue, myIndex) => {
        return (
            <Menu.Item title={myValue.name} key={myIndex} onPress={() => {
                setSelectedWatchlist(myIndex);
                closeMenu()
            }}/>
        )
    })


    return(
        <View>
            <Appbar.Header >
                <Menu
                    visible={visible}
                    anchor={
                        <Appbar.Action icon="menu" onPress={openMenu} />
                    }
                    onDismiss={closeMenu}>
                    {watchlistMenuItem}
                </Menu>
                <Appbar.Content title={watchlists[selectedWatchlist]?.name} subtitle={'Watchlists'} />
            </Appbar.Header>
            <FlatList
                data={watchlists[selectedWatchlist]?.watchlistItems}
                keyExtractor={item => item.instrument.symbol}
                renderItem={({item}) => (
                    <ListItem key={item.instrument.symbol} bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title>{item.instrument.symbol}          {allEntities?.[item.instrument.symbol]?.['29'] || '0.00'}%</ListItem.Title>
                            <ListItem.Subtitle>${allEntities?.[item.instrument.symbol]?.['49'] || '-'}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                )}
            />
        </View>            
    )
}