import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, PanResponder } from "react-native"
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
import { setDayChart, setMonthChart, setWeekChart, setYearChart, setYtdChart, daySelector, weekSelector, monthSelector, yearSelector, ytdSelector, resetChart } from '../Redux/features/chartHistory'
import { quoteSelector } from '../Redux/features/quoteSlice'
import { getChartHistory, getMarketHours } from '../api/AmeritradeApi'
import Colors from '../configs/Colors'
import { renameChartCandles, candleFieldMap, quoteFieldMap } from '../api/AmeritradeHelper';
import * as ChartUtils from '../utils/ChartDataUtils'
import {Chart} from '../Components/Chart/Chart'
import ToggleButtonText from '../Components/ToggleButtonText/ToggleButtonText';
import UseIdleTimer from '../Components/IdleTimer/IdleTimer'



export default function QuoteScreen ( {navigation: {goBack}, route} ) {
    const defaultChartPeriod = '1D'
    const periodButtons = ['1D', '1W', '1M', '1Y', 'YTD']

    const dispatch = useDispatch();
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
    const [chartCandles, setChartCandles] = React.useState(dayChart);

    let percentDelta:number = ChartUtils.percentDelta(quoteData[quoteFieldMap.Close], quoteData[quoteFieldMap.Mark])

    useEffect(() => {
        console.log(AccessToken)
        if (AccessToken?.access_token){
            onLoad();
        }
        async function onLoad () {
            dispatch(send(ChartEquityRequest(PrincipalData, Symbol)));
            let marketHours = await getMarketHours(AccessToken.access_token, "EQUITY");
            setMarketIsOpen(marketHours?.equity?.EQ?.isOpen || false);   

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
    }, [AccessToken])

    useEffect(() => {
        onChartPeriodChange();
        async function onChartPeriodChange() {
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
        dispatch(resetChart());
        goBack()
    }



    return (
        <View style={{flex:1,  backgroundColor: Colors.MainDark}}>
            <Appbar.Header
                statusBarHeight={0} 
                style={{backgroundColor: Colors.MainDark}}>
            <Appbar.Action 
                icon={'arrow-left'}
                onPress={() => onGoBack()}
            />
            <Appbar.Content title={Symbol}/>
            </Appbar.Header>
            <ScrollView>
            <Text>debug mark: {ChartUtils.valueToString(quoteData[quoteFieldMap.Mark])}</Text>
            <Text>debug delta: {ChartUtils.percentToString(percentDelta)}</Text>

            <Chart height={200} priceHistory={chartCandles} />
            
            <View style={[styles.row]}>
            {periodButtons.map((period) => {
                return (
                    <Button key={period} color={Colors.TextLight} style={[styles.buttonRow]} onPress={()=>setPeriod(period)} mode={chartPeriod==period? 'contained':'text'}>{period}</Button>
                )
            })}
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