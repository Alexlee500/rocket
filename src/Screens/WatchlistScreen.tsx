import React, { useEffect, useState } from 'react';
import  {View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Appbar, Menu } from 'react-native-paper';
import  DataTable from '../Components/DataTable/DataTable'

import Colors from '../configs/Colors'
import { selectWatchlist } from '../Redux/features/tdaSlice';
import { quoteSelector } from '../Redux/features/quoteSlice';
import { quoteFieldMap } from '../api/AmeritradeHelper';
import * as cdUtils from '../utils/ChartDataUtils'

export default function WatchlistScreen({navigation:{navigate}}) {
    const allEntities = useSelector(quoteSelector.selectEntities);
    const watchlists:Watchlists[] = useSelector( selectWatchlist )

    const [visible, setVisible] = React.useState(false);
    const [selectedWatchlist, setSelectedWatchlist] = useState(0);
    const [sortConfig, setSortConfig] = React.useState({key: "symbol", direction: "ascending"});
    const [watchlistSymbols, setWatchlistSymbols] = React.useState([])

    useEffect(() => {

        const getSelectedWatchlistSymbols = () => {

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
            return sortable
        }
        let res = sortWatchlist()
        setWatchlistSymbols(res);
    }, [watchlists, selectedWatchlist, sortConfig, allEntities])


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

    const requestSort = (key:string) => {
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


    const watchlistRows = watchlistSymbols.map((item) => {
        //let percentDelta =  (((allEntities?.[item]?.[quoteFieldMap.Mark]-allEntities?.[item]?.[quoteFieldMap.Close])/allEntities?.[item]?.[quoteFieldMap.Close] ) * 100).toFixed(2)
        const percentDelta = cdUtils.percentDelta(allEntities?.[item]?.[quoteFieldMap.Close], allEntities?.[item]?.[quoteFieldMap.Mark])
        return (
            <DataTable.Row key={item} onPress={() => { navigate('Quote', {symbol:item})}}>
            <DataTable.Cell >{item}</DataTable.Cell>
            <DataTable.Cell numeric >
                {cdUtils.valueToString(allEntities?.[item]?.[quoteFieldMap.Mark])}
            </DataTable.Cell>
            <DataTable.Cell numeric 
                direction={cdUtils.getDirection(percentDelta)}>
                    {cdUtils.percentToString(percentDelta)}
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
