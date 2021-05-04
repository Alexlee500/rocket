import React, { useEffect, useState } from 'react';
import  {Text, View, Button, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, Menu, Divider, List, DataTable } from 'react-native-paper';
import { selectWatchlist } from '../Redux/features/tdaSlice';

import { quoteSelector } from '../Redux/features/quoteSlice';

export default function WatchlistScreen() {
    const [selectedWatchlist, setSelectedWatchlist] = useState(0);
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);


    const allEntities = useSelector(quoteSelector.selectEntities);
    const watchlists:Watchlists[] = useSelector( selectWatchlist )



    let watchlistMenuItem = watchlists.map((myValue, myIndex) => {
        return (
            <Menu.Item title={myValue.name} 
                key={myIndex} 
                onPress={() => {
                    setSelectedWatchlist(myIndex);
                    closeMenu()
            }}/>
        )
    })

    let watchlistDatatableItem = watchlists[selectedWatchlist]?.watchlistItems.map((item)=> {

        let percentDelta =  (((allEntities?.[item.instrument.symbol]?.['49']-allEntities?.[item.instrument.symbol]?.['15'])/allEntities?.[item.instrument.symbol]?.['15'] ) * 100).toFixed(2)
        
        return (    
            <DataTable.Row key={item.instrument.symbol}>
                <DataTable.Cell>{item.instrument.symbol}</DataTable.Cell>
                <DataTable.Cell numeric>${allEntities?.[item.instrument.symbol]?.['49'] || '$0.00'}</DataTable.Cell>
                <DataTable.Cell numeric>{percentDelta}%</DataTable.Cell>
            </DataTable.Row>
        )
    })

    

    let watchlistListItem = (item) => {

        return (

            <List.Item
                key={item.instrument.symbol}
                title={item.instrument.symbol}
                right={props => <Text>{allEntities?.[item.instrument.symbol]?.['29'] || '+0.00'}</Text>}
            />
        )
    }


    return(
        <View style={{flex:1, backgroundColor: '#342E38'}}>
            <Appbar.Header statusBarHeight={0} >
                <Menu
                    visible={visible}
                    statusBarHeight={0}
                    anchor={
                        <Appbar.Action icon="menu" onPress={openMenu} />
                    }
                    onDismiss={closeMenu}>
                    {watchlistMenuItem}
                </Menu>
                <Appbar.Content title={watchlists[selectedWatchlist]?.name} subtitle={'Watchlists'} />
            </Appbar.Header>
            <DataTable style={{flex:1}}>
                <DataTable.Header>
                    <DataTable.Title sortDirection='descending'>Symbol</DataTable.Title>
                    <DataTable.Title numeric>Price</DataTable.Title>
                    <DataTable.Title numeric>% Change</DataTable.Title>
                </DataTable.Header>     
                <ScrollView> 
                {watchlistDatatableItem}
                </ScrollView> 
            </DataTable>
        </View>            
    )
}


/*
            <FlatList
                data={watchlists[selectedWatchlist]?.watchlistItems}
                keyExtractor={item => item.instrument.symbol}
                renderItem={({item}) => (
                    watchlistListItem(item)
                )}
            />

            */