import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from "react-native"
import { Appbar, List, Card, Title, Paragraph, Menu, Text, ToggleButton} from 'react-native-paper';
import { useDispatch, useSelector} from 'react-redux';
import { send } from '@alexlee500/redux-websocket/ReduxWebsocket'
import { Svg, G, Path , Polyline } from 'react-native-svg'
import * as d3 from "d3";
import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { getTime, endOfToday } from 'date-fns'

import { ChartEquityRequest, ChartHistoryRequest} from '../api/AmeritradeSockRequests';
import { selectAccessToken, selectUserPrincipals } from '../Redux/features/tdaSlice'
import { chartSelector, setChart, resetChart } from '../Redux/features/chartSlice'
import { quoteSelector } from '../Redux/features/quoteSlice'
import { getChartHistory } from '../api/AmeritradeApi'
import Colors from '../configs/Colors'
import { renameChartCandles, candleFieldMap, quoteFieldMap } from '../api/AmeritradeHelper';
import * as ChartUtils from '../utils/ChartDataUtils'
import {Chart} from '../Components/Chart/Chart'
import ToggleButtonText from '../Components/ToggleButtonText/ToggleButtonText';
import ToggleButtonRow from '../Components/ToggleButtonRow/ToggleButtonRow';

export default function QuoteScreen ( {navigation: {goBack}, route} ) {
    const defaultChartPeriod = '1D'

    const dispatch = useDispatch();
    const chartData = useSelector(chartSelector.selectEntities)
    const quoteData = useSelector(quoteSelector.selectEntities)[route.params.symbol]
    const PrincipalData:any = useSelector( selectUserPrincipals )
    const AccessToken:any = useSelector( selectAccessToken )
    const [Symbol, setSymbol] = React.useState(route.params.symbol)
    const [chartPeriod, setPeriod] = React.useState(defaultChartPeriod);


    useEffect(() => {
        onLoad();
        async function onLoad () {
            dispatch(send(ChartEquityRequest(PrincipalData, Symbol)));
            //dispatch(send(ChartHistoryRequest(PrincipalData, Symbol, 'm1', 'd1')))
        }
    }, [])

    useEffect(() => {
        onChartPeriodChange();
        async function onChartPeriodChange() {
            let candleData
            switch (chartPeriod){
                case '1D':
                    candleData = await getChartHistory(AccessToken.access_token, Symbol, "day", "1", "minute", "5", true);
                    break;
                case '1W':
                    candleData = await getChartHistory(AccessToken.access_token, Symbol, "day", "5", "minute", "30", true);
                    break;
                case '1M':
                    candleData = await getChartHistory(AccessToken.access_token, Symbol, "month", "1", "daily", "1", false);
                    break;
                case '1Y':
                    candleData = await getChartHistory(AccessToken.access_token, Symbol, "year", "1", "daily", "1", true);
                    break;
                case 'YTD':
                    candleData = await getChartHistory(AccessToken.access_token, Symbol, "ytd", "1", "daily", "1", true);
                    break;
            }
             
            try{            
                candleData = renameChartCandles(candleData)
                let chart = {
                    candles: candleData,
                    periodType: 'day',
                    period: '5',
                    frequencyType: 'minute',
                    frequency: '30'
                }
                dispatch(setChart(chart))
                let keys = Object.keys(chartData)
                keys.sort( (a:any,b:any) => {return a-b} );
            }catch(e){
                console.log(e)
            }

        }

    }, [chartPeriod])


    const onGoBack = () => {
        dispatch(resetChart());
        goBack()
    }


    const buildGraphLine = () => {
        let dataArr = Object.values(chartData).sort( (a, b) => {return a[candleFieldMap.Time] - b[candleFieldMap.Time]})

        
        const xScale = scaleLinear()
            .domain(d3.extent(dataArr, s => s[candleFieldMap.Time]))
            .range([10, Dimensions.get('window').width -10])
        
        const xScale2 = scaleLinear()
            .domain([0, dataArr.length])
            .range([10, Dimensions.get('window').width -10])
        
        const yScale = scaleLinear()
            .domain(d3.extent(dataArr, s=> s[candleFieldMap.Close]))
            .range([400, 10])

        

        let formattedVals = dataArr.map(
            (item) => [parseFloat(xScale(item[candleFieldMap.Time])), parseFloat(yScale(item[candleFieldMap.Close]))] as [number, number]
        )
        //console.log(formattedVals)
        let points = dataArr?.map((item) => {
            return `${xScale(item[candleFieldMap.Time])},${yScale(item[candleFieldMap.Close])}`
        })


        let timeSkipVals = dataArr.map(
            (item, idx ) => [parseFloat(xScale2(idx)), parseFloat(yScale(item[candleFieldMap.Close]))]
        )


        let final = points?.reduce((res, item) =>{
            return `${res} ${item}`
        }, '')



        const s = shape
        .line()
        .x(([x]) => x as number)
        .y(([,y]) => y as number)
        .curve(shape.curveBasis)(formattedVals) as string

        const s2 = shape
        .line()
        .x(([x]) => x as number)
        .y(([,y]) => y as number)
        .curve(shape.curveBasis)(timeSkipVals) as string


        return (
            <Path 
            d={s2}
            strokeWidth="2"
            stroke={ChartUtils.getDirection(percentDelta) != 0 ? (ChartUtils.getDirection(percentDelta) > 0 ? Colors.Green : Colors.Red) : Colors.TextLight}
            />
        )
    }

    //let percentDelta:number = Number((((quoteData[quoteFieldMap.Mark] - quoteData[quoteFieldMap.Close]) / quoteData[quoteFieldMap.Close]) * 100).toFixed(2))
    let percentDelta:number = ChartUtils.percentDelta(quoteData[quoteFieldMap.Close], quoteData[quoteFieldMap.Mark])
    //let percentDeltaDir:number = ChartUtils.getDirection(percentDelta);
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
            <Svg width= {Dimensions.get('window').width} height="400">
                <G>        
                    {buildGraphLine()}  
                </G>
            </Svg>
            <ToggleButton.Row style={[styles.row]} onValueChange={value => setPeriod(value)} value={chartPeriod}>
                <ToggleButtonText color={Colors.TextLight} style={[styles.buttonRow]} value="1D">1D</ToggleButtonText>
                <ToggleButtonText color={Colors.TextLight} style={[styles.buttonRow]} value="1W">1W</ToggleButtonText>
                <ToggleButtonText color={Colors.TextLight} style={[styles.buttonRow]} value="1M">1M</ToggleButtonText>
                <ToggleButtonText color={Colors.TextLight} style={[styles.buttonRow]} value="1Y">1Y</ToggleButtonText>
                <ToggleButtonText color={Colors.TextLight} style={[styles.buttonRow]} value="YTD">YTD</ToggleButtonText>
            </ToggleButton.Row>
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