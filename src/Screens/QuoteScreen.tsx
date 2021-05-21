import React, { useEffect } from 'react';
import { ScrollView, View, Dimensions } from "react-native"
import { Appbar, List, Card, Title, Paragraph, Menu, Text} from 'react-native-paper';
import { useDispatch, useSelector} from 'react-redux';
import { send } from '@alexlee500/redux-websocket/ReduxWebsocket'
import { Svg, G, Path , Polyline } from 'react-native-svg'
import * as d3 from "d3";
import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { mixPath, parse } from "react-native-redash";


import { ChartEquityRequest, ChartHistoryRequest} from '../api/AmeritradeSockRequests';
import { selectAccessToken, selectUserPrincipals } from '../Redux/features/tdaSlice'
import { chartSelector, setChart } from '../Redux/features/chartSlice'
import { quoteSelector } from '../Redux/features/quoteSlice'
import { getChartHistory } from '../api/AmeritradeApi'
import Colors from '../configs/Colors'
import { renameChartCandles, candleFieldMap, quoteFieldMap } from '../api/AmeritradeHelper';

export default function QuoteScreen ( {navigation: {goBack}, route} ) {
    const dispatch = useDispatch();
    const chartData = useSelector(chartSelector.selectEntities)
    const quoteData = useSelector(quoteSelector.selectEntities)[route.params.symbol]
    const PrincipalData:any = useSelector( selectUserPrincipals )
    const AccessToken:any = useSelector( selectAccessToken )
    const [Symbol, setSymbol] = React.useState(route.params.symbol)
    const [LinePoints, setLinePoints] = React.useState('');

    useEffect(() => {
        onLoad();
        async function onLoad () {
            dispatch(send(ChartEquityRequest(PrincipalData, Symbol)));
            let candleData = await getChartHistory(AccessToken.access_token, Symbol, "day", "1", "minute", "5", true);
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
            keys.sort( (a,b) => {return a-b} );
        }
    }, [])

    //console.log(`chart data ${JSON.stringify(chartData)}`)

    /*
    const linePoints = () => {
        let points = ChartX.map((item) => {
            return `${item},${chartData[item][candleFieldMap.Close]}`
        })
        let final = points.reduce((res, item) =>{
            return `${res} ${item}`
        })
        
        setLinePoints(final)
    }
    */


    const buildGraphPath = () => {
        let dataArr = Object.values(chartData)

        const xScale = scaleLinear()
            .domain(d3.extent(dataArr, s => s[candleFieldMap.Time]))
            .range([10, Dimensions.get('window').width -10])

        const yScale = scaleLinear()
            .domain(d3.extent(dataArr, s=> s[candleFieldMap.Close]))
            .range([10, 200])

            /*
        let p = parse(
            shape
            .line()
            .x(([,x]) => xScale(x) as number)
            .y(([y]) => yScale(y) as number)
            .curve(shape.curveBasis()))
*/
        
        //console.log(p)  
    }
    const buildGraphLine = () => {
        let dataArr = Object.values(chartData)
        //let xTimes = Object.keys(chartData)
       // xTimes.sort( (a,b) => {return a-b} );
        //let yPrice = xTimes.map((item) => chartData[item]["4"])
        

        
        const xScale = scaleLinear()
            .domain(d3.extent(dataArr, s => s[candleFieldMap.Time]))
            .range([10, Dimensions.get('window').width -10])
        
        
        const yScale = scaleLinear()
            .domain(d3.extent(dataArr, s=> s[candleFieldMap.Close]))
            .range([200, 10])

        

        let formattedVals = dataArr.map(
            (item) => [parseFloat(xScale(item[candleFieldMap.Time])), parseFloat(yScale(item[candleFieldMap.Close]))] as [number, number]
        )
        //console.log(formattedVals)
        let points = dataArr?.map((item) => {
            return `${xScale(item[candleFieldMap.Time])},${yScale(item[candleFieldMap.Close])}`
        })
        //console.log(points)
        
        let final = points?.reduce((res, item) =>{
            return `${res} ${item}`
        }, '')
        //const path = new Path(final)


        const s = shape
        .line()
        .x(([x]) => x as number)
        .y(([,y]) => y as number)
        .curve(shape.curveBasis)(formattedVals) as string

        
        //console.log(s)
        //const p = parse(s)
        //console.log(p)

        return (
            
            /*
            <Polyline 
            points={final}
            fill="none"
            stroke={getDirection(percentDelta) != 0 ? (getDirection(percentDelta) > 0 ? Colors.Green : Colors.Red) : Colors.TextLight}
            strokeWidth="2"
            />*/
            <Path
                d={s}
                strokeWidth="2"
                stroke={getDirection(percentDelta) != 0 ? (getDirection(percentDelta) > 0 ? Colors.Green : Colors.Red) : Colors.TextLight}
                fill="none"

            />
            
            /*
            <path 
            d={final}
            strokeWidth="2"
            stroke={getDirection(percentDelta) != 0 ? (getDirection(percentDelta) > 0 ? Colors.Green : Colors.Red) : Colors.TextLight}
            />*/
        )
    }

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

    let percentDelta:number = Number((((quoteData[quoteFieldMap.Mark] - quoteData[quoteFieldMap.Close]) / quoteData[quoteFieldMap.Close]) * 100).toFixed(2))
    
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
            <Text>debug mark: {parseValue(quoteData[quoteFieldMap.Mark])}</Text>
            <Text>debug delta: {parseValuePercent(percentDelta)}</Text>
            <Svg width= {Dimensions.get('window').width} height="250">
                <G>        
                    {buildGraphLine()}  
                     
                </G>
                </Svg>
            </ScrollView>
        </View>
    )
}
