import React, { useEffect, useState } from 'react';
import  {Text, View, Button, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, Menu, Divider, List, DataTable } from 'react-native-paper';
import { selectWatchlist } from '../Redux/features/tdaSlice';

import { quoteSelector } from '../Redux/features/quoteSlice';

import { quoteFieldMap } from '../api/AmeritradeHelper';





export default function WatchlistScreen() {
    const [selectedWatchlist, setSelectedWatchlist] = useState(0);
    const [watchlistData, setWatchlistData] = useState([]);
    const [visible, setVisible] = React.useState(false);
    const [sortConfig, setSortConfig] = React.useState({key: "Symbol", direction: "ascending"});

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);


    const allEntities = useSelector(quoteSelector.selectEntities);
    const watchlists:Watchlists[] = useSelector( selectWatchlist )



    const setOrderedWatchlist = useEffect(() => {

    }, [selectedWatchlist, watchlists])



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


    const sortable = useEffect(() => {

        console.log(`Sort by ${JSON.stringify(sortConfig)}`)

        let sortItems = [...dataItem]
        sortItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]){
                return sortConfig.direction === 'ascending' ? -1 : 1
            }
            if (a[sortConfig.key] > b[sortConfig.key]){
                return sortConfig.direction === 'ascending' ? 1 : -1
            }
            return 0
        })
        console.log(sortItems)

        setWatchlistData(sortItems);
        
    },[sortConfig])
    


    const requestSort = (key) => {
        console.log(`requestSort ${key}`)
        let direction = 'ascending';
        if (
          sortConfig &&
          sortConfig.key === key &&
          sortConfig.direction === 'ascending'
        ) {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
      };

    
    const mapDataItems = (props) => {
        const dataItem = props.map((item)=> {
            let percentDelta =  (((allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Mark]-allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Close])/allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Mark] ) * 100).toFixed(2)
    
            return (
                {
                    Symbol: item.instrument.symbol,
                    Mark: allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Mark],
                    PercentChange: percentDelta
                }
            )
        })
        return (dataItem)    
    }


    const dataItem = watchlists[selectedWatchlist]?.watchlistItems.map((item)=> {
        let percentDelta =  (((allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Mark]-allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Close])/allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Mark] ) * 100).toFixed(2)

        return (
            {
                Symbol: item.instrument.symbol,
                Mark: allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Mark],
                PercentChange: percentDelta
            }
        )
    })
    

    let watchlistItemTest = mapDataItems(watchlists[selectedWatchlist]?.watchlistItems).map((item) => {
        <DataTable.Row key={item.Symbol}>
        <DataTable.Cell>{item.Symbol}</DataTable.Cell>
        <DataTable.Cell numeric>${item.Mark}</DataTable.Cell>
        <DataTable.Cell numeric>{item.PercentChange}%</DataTable.Cell>
        </DataTable.Row>
    })

    let watchlistDatatableItem = watchlists[selectedWatchlist]?.watchlistItems.map((item)=> {

        let percentDelta =  (((allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Mark]-allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Close])/allEntities?.[item.instrument.symbol]?.[quoteFieldMap.Mark] ) * 100).toFixed(2)
        
        return (    
            <DataTable.Row key={item.instrument.symbol}>
                <DataTable.Cell>{item.instrument.symbol}</DataTable.Cell>
                <DataTable.Cell numeric>${allEntities?.[item.instrument.symbol]?.['49'] || '$0.00'}</DataTable.Cell>
                <DataTable.Cell numeric>{percentDelta}%</DataTable.Cell>
            </DataTable.Row>
        )
    })

    


    const WatchlistDataTableItems = (props) => {
        let listItems = (props.orderedWatchlist).map((item) => {
            <DataTable.Row key={item.Symbol}>
            <DataTable.Cell>{item.Symbol}</DataTable.Cell>
            <DataTable.Cell numeric>${item.Mark}</DataTable.Cell>
            <DataTable.Cell numeric>{item.PercentChange}%</DataTable.Cell>
            </DataTable.Row>
        })

        return listItems
    }

    const WatchlistTable = (props) => {
        return (
            <DataTable style={{flex:1}}>
                <DataTable.Header> 


                <DataTable.Title
                    sortDirection={
                        (sortConfig.key === 'Symbol') ? (
                            sortConfig.direction === 'ascending' ? 'ascending' : 'descending'
                        ):null }
                    onPress={
                        ()=>{ requestSort('Symbol')}
                    }>Symbol</DataTable.Title>


                <DataTable.Title numeric
                    sortDirection={
                        (sortConfig.key === 'Mark') ? (
                            sortConfig.direction === 'ascending' ? 'ascending' : 'descending'
                        ):null
                    }
                    onPress={()=>{
                        requestSort('Mark')
                    }}>Price</DataTable.Title>
                <DataTable.Title numeric
                    sortDirection={
                        (sortConfig.key === 'Percent') ? (
                            sortConfig.direction === 'ascending' ? 'ascending' : 'descending'
                        ):null
                    }
                    onPress={()=>{
                        requestSort('Percent')
                    }}>% Change</DataTable.Title>
            </DataTable.Header>     
                <ScrollView> 
                    <WatchlistDataTableItems
                        orderedWatchlist={watchlistData}
                    />
                </ScrollView> 
            </DataTable>
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
                <DataTable.Title
                    sortDirection={
                        (sortConfig.key === 'Symbol') ? (
                            sortConfig.direction === 'ascending' ? 'ascending' : 'descending'
                        ):null
                    }
                    onPress={()=>{
                        requestSort('Symbol')
                    }}>Symbol</DataTable.Title>
                <DataTable.Title numeric
                    sortDirection={
                        (sortConfig.key === 'Mark') ? (
                            sortConfig.direction === 'ascending' ? 'ascending' : 'descending'
                        ):null
                    }
                    onPress={()=>{
                        requestSort('Mark')
                    }}>Price</DataTable.Title>
                <DataTable.Title numeric
                    sortDirection={
                        (sortConfig.key === 'Percent') ? (
                            sortConfig.direction === 'ascending' ? 'ascending' : 'descending'
                        ):null
                    }
                    onPress={()=>{
                        requestSort('Percent')
                    }}>% Change</DataTable.Title>
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