import React, { useEffect } from 'react';
import { View, Text } from "react-native"
import { Appbar, List, Card, Title, Paragraph, Menu} from 'react-native-paper';

import Colors from '../configs/Colors'

export default function QuoteScreen ( {navigation: {goBack}, route} ) {

    console.log(route.params.symbol)
    const [Symbol, setSymbol] = React.useState(route.params.symbol)

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
        </View>
    )
}
