import React from 'react';
import { View, StyleSheet, Dimensions } from "react-native"
import { Svg, G, Path } from 'react-native-svg'
import * as d3 from "d3";
import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { ActivityIndicator } from 'react-native-paper';


import { candleFieldMap } from '../../api/AmeritradeHelper';
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

    const path = getPath()
    return (
        <View>
            <Svg width={Dimensions.get('window').width} height={height}>
                <G>
                <ActivityIndicator animating={path? false : true} color={Colors.TextLight} size="large" style={styles.center}/>
                    <Path
                        d={path}
                        strokeWidth="2"
                        stroke={ Colors.Green }
                    />
                </G>
            </Svg>
        </View>

    )

    
}

export { Chart }

const styles = StyleSheet.create({
    center:{
        justifyContent: 'center',
        paddingTop: 20
    }
})