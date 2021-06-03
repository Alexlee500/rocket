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


type Props = {
    height: number,
    priceHistory: any
}

const Chart = ({height, priceHistory } : Props) => {
    const getPath = () => {
        try{
            let dataArr = Object.values(priceHistory).sort( (a, b) => {return a[candleFieldMap.Time] - b[candleFieldMap.Time]})
            
            const xScale = scaleLinear()
                .domain([0, dataArr.length])
                .range([10, Dimensions.get('window').width -10])
            
            const yScale = scaleLinear()
                .domain(d3.extent(dataArr, s=> s[candleFieldMap.Close]))
                .range([height, 0])
    
            let timeSkipVals = dataArr.map(
                (item, idx ) => [parseFloat(xScale(idx)), parseFloat(yScale(item[candleFieldMap.Close]))]
            )

    
            const path = shape
            .line()
            .x(([x]) => x as number)
            .y(([,y]) => y as number)
            .curve(shape.curveBasis)(timeSkipVals) as string
            return (path)
        }catch(e){
            console.log(e)
        }
        
    }
    
    return (
        
        <View>
        <Svg width={Dimensions.get('window').width} height={height}>
            <G>
                <Path
                    d={getPath()}
                    strokeWidth="2"
                    stroke={Colors.Green}
                />
            </G>
        </Svg>
        </View>

    )
}

export { Chart }

