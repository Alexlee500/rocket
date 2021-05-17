import React, { useEffect, useState } from 'react';
import  {View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Appbar, Menu } from 'react-native-paper';
import  DataTable from '../Components/DataTable/DataTable'

import Colors from '../configs/Colors'
import { selectWatchlist } from '../Redux/features/tdaSlice';
import { quoteSelector } from '../Redux/features/quoteSlice';
import { quoteFieldMap } from '../api/AmeritradeHelper';

export default function WatchlistScreen({navigation:{navigate}}) {
    const allEntities = useSelector(quoteSelector.selectEntities);
    const watchlists:Watchlists[] = useSelector( selectWatchlist )

    const [visible, setVisible] = React.useState(false);
    const [selectedWatchlist, setSelectedWatchlist] = useState(0);
    const [sortConfig, setSortConfig] = React.useState({key: "symbol", direction: "ascending"});
    const [watchlistSymbols, setWatchlistSymbols] = React.useState([])

    useEffect(() => {

        const getSelectedWatchlistSymbols = () => {
            console.log(`getSelectedWatchlistSymbols`)

            let symList = watchlists[selectedWatchlist].watchlistItems.map((item) => {
                return item.instrument.symbol
            })
            return symList;
        }



        const sortWatchlist = () => {
            let sortable = [...getSelectedWatchlistSymbols()]

            if (sortConfig.key === 'symbol'){
                sortable.sort((a, b) => {
                    if (a < b){
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a > b){
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0
                })            
            }

            if (sortConfig.key === 'mark'){
                sortable.sort((a, b) => {
                    if (allEntities[a]?.[quoteFieldMap.Mark] < allEntities[b]?.[quoteFieldMap.Mark] ){
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (allEntities[a]?.[quoteFieldMap.Mark]  > allEntities[b]?.[quoteFieldMap.Mark]){
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                return 0
                })
            }

            if (sortConfig.key === 'percentChange'){
                sortable.sort((a, b) => {
                    let aDelta =  ((allEntities?.[a]?.[quoteFieldMap.Mark]-allEntities?.[a]?.[quoteFieldMap.Close])/allEntities?.[a]?.[quoteFieldMap.Mark]) || 0
                    let bDelta =  ((allEntities?.[b]?.[quoteFieldMap.Mark]-allEntities?.[b]?.[quoteFieldMap.Close])/allEntities?.[b]?.[quoteFieldMap.Mark]) || 0

                    if (aDelta < bDelta ){
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aDelta > bDelta){
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                return 0
                })
            }
            console.log(sortable)
            return sortable
        }
        let res = sortWatchlist()
        setWatchlistSymbols(res);
    }, [watchlists, selectedWatchlist, sortConfig])


    let watchlistMenuItem = watchlists.map((myValue, myIndex) => {
        return (
            <Menu.Item title={myValue.name} 
                key={myIndex} 
                onPress={() => {
                    setSelectedWatchlist(myIndex);
                    setVisible(false);
            }}/>
        )
    })

    const requestSort = (key) => {
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

    const parseValue = (val) => {
        return (!isNaN(val) && val != null) ? (
            (val < 0? '-' : '') + '$'+ Math.abs(val).toFixed(2)
        ):(
            '-'
        )
    }

    const parseValuePercent = (val) => {
        return (!isNaN(val) && val != null) ? (
            (val>=0? '+':'') + val + '%'
        ):(
            '-'
        )
    }

    const getDirection = (val) => {
        if (val > 0) return 1;
        if (val < 0) return -1;
        return 0;
    }

    const watchlistRows = watchlistSymbols.map((item) => {
        let percentDelta =  (((allEntities?.[item]?.[quoteFieldMap.Mark]-allEntities?.[item]?.[quoteFieldMap.Close])/allEntities?.[item]?.[quoteFieldMap.Close] ) * 100).toFixed(2)
        
        return (
            <DataTable.Row key={item} onPress={() => { navigate('Quote', {symbol:item})}}>
            <DataTable.Cell >{item}</DataTable.Cell>
            <DataTable.Cell numeric >
                {parseValue(allEntities?.[item]?.[quoteFieldMap.Mark])}
            </DataTable.Cell>
            <DataTable.Cell numeric 
                direction={getDirection(percentDelta)}>
                    {parseValuePercent(percentDelta)}
            </DataTable.Cell>
            </DataTable.Row>
        )

    })

    return (
        <View style={{flex:1, backgroundColor: Colors.MainDark}}>
            <Appbar.Header 
                statusBarHeight={0} 
                style={{backgroundColor: Colors.MainDark}}>
                <Menu
                    visible={visible}
                    statusBarHeight={0}
                    style={{backgroundColor: Colors.SecondaryDark}}
                    contentStyle={{backgroundColor: Colors.SecondaryDark}}

                    anchor={
                        <Appbar.Action 
                            icon={'menu' }
                            onPress={ () => setVisible(true)} 
                            color={Colors.TextLight}/>
                    }
                    onDismiss={() => setVisible(false)}>
                    {watchlistMenuItem}
                </Menu>
                <Appbar.Content 
                    title={watchlists[selectedWatchlist]?.name} 
                    subtitle={'Watchlists'} 
                    color={Colors.TextLight}
                    />
            </Appbar.Header>
            <DataTable style={{flex:1}}>
            <DataTable.Header>
            <DataTable.Title
                sortDirection={
                    (sortConfig.key === 'symbol') ? (
                        sortConfig.direction === 'ascending' ? 'ascending' : 'descending'
                    ):null }
                onPress={
                    ()=>{ requestSort('symbol')}
                }>Symbol</DataTable.Title>

            <DataTable.Title numeric
                    sortDirection={
                        (sortConfig.key === 'mark') ? (
                            sortConfig.direction === 'ascending' ? 'ascending' : 'descending'
                        ):null
                    }
                    onPress={()=>{
                        requestSort('mark')
                    }}>Price</DataTable.Title>   
                            <DataTable.Title numeric
                    sortDirection={
                        (sortConfig.key === 'percentChange') ? (
                            sortConfig.direction === 'ascending' ? 'ascending' : 'descending'
                        ):null
                    }
                    onPress={()=>{
                        requestSort('percentChange')
                    }}>% Change</DataTable.Title>
            </DataTable.Header>
            <ScrollView > 
                {watchlistRows}
            </ScrollView> 
            </DataTable>
        </View>
    )
}
