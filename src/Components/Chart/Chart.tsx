import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, StyleProp, ViewStyle, View, Dimensions } from "react-native"
import { Svg, G, Path , Polyline } from 'react-native-svg'
import { Button, Text } from 'react-native-paper';
import { useDispatch, useSelector} from 'react-redux';
import * as d3 from "d3";
import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";


import { chartSelector } from '../../Redux/features/chartSlice'
import { quoteSelector } from '../../Redux/features/quoteSlice'

import { renameChartCandles, candleFieldMap, quoteFieldMap } from '../../api/AmeritradeHelper';
import * as ChartUtils from '../../utils/ChartDataUtils'
import Colors from '../../configs/Colors';


export function Chart(){
    
    const [chartPeriod, setChartPeriod] = React.useState('1D')

    
    return (
        <View style={[styles.row]}>        
        <Button compact mode={chartPeriod == '1D'? 'contained':'text'} style={[styles.buttonRow]} color={Colors.TextLight} onPress={() => {setChartPeriod('1D')}}>1D</Button>
        <Button compact mode={chartPeriod == '1W'? 'contained':'text'} style={[styles.buttonRow]} color={Colors.TextLight} onPress={() => {setChartPeriod('1W')}}>1W</Button>
        <Button compact mode={chartPeriod == '1M'? 'contained':'text'} style={[styles.buttonRow]} color={Colors.TextLight} onPress={() => {setChartPeriod('1M')}}>1M</Button>
        <Button compact mode={chartPeriod == '1Y'? 'contained':'text'} style={[styles.buttonRow]} color={Colors.TextLight} onPress={() => {setChartPeriod('1Y')}}>1Y</Button>
        <Button compact mode={chartPeriod == 'All'? 'contained':'text'} style={[styles.buttonRow]} color={Colors.TextLight} onPress={() => {setChartPeriod('All')}}>All</Button>
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

