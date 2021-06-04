import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from "react-native"
import { Appbar, List, Card, Title, Paragraph, Button, Text, ToggleButton} from 'react-native-paper';
import { useDispatch, useSelector} from 'react-redux';
import { send } from '@alexlee500/redux-websocket/ReduxWebsocket'
import { Svg, G, Path , Polyline } from 'react-native-svg'
import * as d3 from "d3";
import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { getTime, endOfToday } from 'date-fns'

import { ChartEquityRequest, ChartHistoryRequest} from '../api/AmeritradeSockRequests';
import { selectAccessToken, selectUserPrincipals } from '../Redux/features/tdaSlice'
//import { chartSelector, setChart, resetChart } from '../Redux/features/chartSlice'
import { setDayChart, setMonthChart, setWeekChart, setYearChart, setYtdChart, daySelector, weekSelector, monthSelector, yearSelector, ytdSelector } from '../Redux/features/chartHistory'
import { quoteSelector } from '../Redux/features/quoteSlice'
import { getChartHistory, getMarketHours } from '../api/AmeritradeApi'
import Colors from '../configs/Colors'
import { renameChartCandles, candleFieldMap, quoteFieldMap } from '../api/AmeritradeHelper';
import * as ChartUtils from '../utils/ChartDataUtils'
import {Chart} from '../Components/Chart/Chart'
import ToggleButtonText from '../Components/ToggleButtonText/ToggleButtonText';



export default function QuoteScreen ( {navigation: {goBack}, route} ) {
    const defaultChartPeriod = '1D'

    const dispatch = useDispatch();
    //const chartData = useSelector(chartSelector.selectEntities)
    const quoteData = useSelector(quoteSelector.selectEntities)[route.params.symbol]
    const dayChart = useSelector(daySelector.selectEntities);
    const weekChart = useSelector(weekSelector.selectEntities);
    const monthChart = useSelector(monthSelector.selectEntities);
    const yearChart = useSelector(yearSelector.selectEntities);
    const ytdChart = useSelector(ytdSelector.selectEntities);

    const PrincipalData:any = useSelector( selectUserPrincipals )
    const AccessToken:any = useSelector( selectAccessToken )

    const [Symbol, setSymbol] = React.useState(route.params.symbol)
    const [chartPeriod, setPeriod] = React.useState(defaultChartPeriod);
    const [marketIsOpen, setMarketIsOpen] = React.useState(false);
    const [chartCandles, setChartCandles] = React.useState(null);


    useEffect(() => {
        onLoad();
        async function onLoad () {
            dispatch(send(ChartEquityRequest(PrincipalData, Symbol)));
            let marketHours = await getMarketHours(AccessToken.access_token, "EQUITY");
            setMarketIsOpen(marketHours.equity.EQ.isOpen);   

            let dayCD = await getChartHistory(AccessToken.access_token, Symbol, "day", "1", "minute", "10", true, marketIsOpen ? getTime(endOfToday()) : null)
            dayCD = renameChartCandles(dayCD);
            dispatch(setDayChart(dayCD))

            let weekCD = await getChartHistory(AccessToken.access_token, Symbol, "day", "5", "minute", "30", true, marketIsOpen ? getTime(endOfToday()) : null)
            weekCD = renameChartCandles(weekCD)
            dispatch(setWeekChart(weekCD))

            let monthCD = await getChartHistory(AccessToken.access_token, Symbol, "month", "1", "daily", "1", true);
            monthCD = renameChartCandles(monthCD);
            dispatch(setMonthChart(monthCD))
            
            let yearCD = await getChartHistory(AccessToken.access_token, Symbol, "year", "1", "daily", "1", true)
            yearCD = renameChartCandles(yearCD);
            dispatch(setYearChart(yearCD));

            let ytdCD = await getChartHistory(AccessToken.access_token, Symbol, "ytd", "1", "daily", "1", true)
            ytdCD = renameChartCandles(ytdCD);
            dispatch(setYtdChart(ytdCD));

        }
    }, [])

    useEffect(() => {
        onChartPeriodChange();
        async function onChartPeriodChange() {
            //let candleData
            switch (chartPeriod){
                case '1D':
                    setChartCandles(dayChart)
                    break;
                case '1W':
                    setChartCandles(weekChart)
                    break;
                case '1M':
                    setChartCandles(monthChart)
                    break;
                case '1Y':
                    setChartCandles(yearChart)
                    break;
                case 'YTD':
                    setChartCandles(ytdChart)
                    break;
            }

        }

    }, [chartPeriod, dayChart, weekChart, monthChart, yearChart, ytdChart])


    const onGoBack = () => {
        //dispatch(resetChart());
        goBack()
    }


    let percentDelta:number = ChartUtils.percentDelta(quoteData[quoteFieldMap.Close], quoteData[quoteFieldMap.Mark])
    return (
        <View style={{flex:1,  backgroundColor: Colors.MainDark}}>
            <Appbar.Header
                statusBarHeight={0} 
                style={{backgroundColor: Colors.MainDark}}>
            <Appbar.Action 
                icon={'arrow-left'}
                onPress={() => goBack()}
            />
            <Appbar.Content title={Symbol}/>
            </Appbar.Header>
            <ScrollView>
            <Text>debug mark: {ChartUtils.valueToString(quoteData[quoteFieldMap.Mark])}</Text>
            <Text>debug delta: {ChartUtils.percentToString(percentDelta)}</Text>

            <Chart height={400} priceHistory={chartCandles} />
            
  
            <View style={[styles.row]}>
            <Button color={Colors.TextLight} style={[styles.buttonRow]} onPress={()=>setPeriod('1D')} mode={chartPeriod=='1D'? 'contained':'text'}>1D</Button>
            <Button color={Colors.TextLight} style={[styles.buttonRow]} onPress={()=>setPeriod('1W')} mode={chartPeriod=='1W'? 'contained':'text'}>1W</Button>
            <Button color={Colors.TextLight} style={[styles.buttonRow]} onPress={()=>setPeriod('1M')} mode={chartPeriod=='1M'? 'contained':'text'}>1M</Button>
            <Button color={Colors.TextLight} style={[styles.buttonRow]} onPress={()=>setPeriod('1Y')} mode={chartPeriod=='1Y'? 'contained':'text'}>1Y</Button>
            <Button color={Colors.TextLight} style={[styles.buttonRow]} onPress={()=>setPeriod('YTD')} mode={chartPeriod=='YTD'? 'contained':'text'}>YTD</Button>
            </View>
            </ScrollView>
        </View>
    )
}



const styles = StyleSheet.create({
    row:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 20
    },
    buttonRow:{
        width:'20%'
    }
})