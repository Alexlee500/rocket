import React, { useEffect } from 'react';
import  {Text, View, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { send, disconnect  } from '@giantmachines/redux-websocket';

import { resetConnections, selectAccountData, selectUserPrincipals } from '../Redux/features/tdaSlice';
import { LogoutRequest } from '../api/AmeritradeSockRequests';
import { quoteFieldMap, optionFieldMap, renameOptionResponse } from '../api/AmeritradeHelper';

import { deauthenticate } from '../Redux/features/authSlice';
import { Appbar, List, Card, Title, Paragraph, Menu} from 'react-native-paper';


import Colors from '../configs/Colors'
import  DataTable from '../Components/DataTable/DataTable'
import { quoteSelector } from '../Redux/features/quoteSlice';
import DataTableRow from '../Components/DataTable/DataTableRow';
import DataTableCell from '../Components/DataTable/DataTableCell';


export default function AccountScreen() {
    const dispatch = useDispatch();
    const PrincipalData = useSelector( selectUserPrincipals )
    const AccountData:SecuritiesAccount = useSelector(selectAccountData)
    const allEntities = useSelector(quoteSelector.selectEntities);

    const [accountPositions, setAccountPositions] = React.useState([]);
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        const result = {};
        AccountData.securitiesAccount.positions.forEach((item) => {
            const { averagePrice, shortQuantity, longQuantity } = item
            const { symbol, assetType, putCall, description} = item.instrument
            const underlyingSymbol = item.instrument.underlyingSymbol || symbol
            const quantity = shortQuantity || longQuantity
            const longShort = shortQuantity || longQuantity ? 'short' : 'long'
            

            if (!result[underlyingSymbol]) {
                result[underlyingSymbol] = []
            }

            result[underlyingSymbol].push({
                symbol,
                description,
                assetType,
                averagePrice,
                quantity,
                shortQuantity, 
                longQuantity,
                putCall
            })
        })

        const final = Object.keys(result)
            .sort()
            .map((key) => ({
                underlyingSymbol: key,
                positions: result[key]
            }));
        setAccountPositions(final)
    }, [AccountData])
    let printDebug = () => {
        console.log(JSON.stringify(allEntities))
    }
    let onLogout = () => {

        const logout = async() => {
            console.log('logout')
            await dispatch(deauthenticate())
            await dispatch(send(LogoutRequest(PrincipalData)));
            await dispatch(disconnect());
            await dispatch(resetConnections());
        }
        logout();
    }
    
    const parseValue = (val) => {
        return val ? (
            '$'+ val
        ):(
            '-'
        )
    }

    const parseValuePercent = (val) => {
        return val ? (
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

    const positionRows = accountPositions.map((item) => {
        let UnderlyingPercentDelta:number = Number((((allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Mark]-allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Close])/allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Close] ) * 100).toFixed(2))|| null
        if (item.positions.length == 1 && item.positions[0].assetType == 'EQUITY'){
            let currentVal:number = allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Mark] * item.positions[0].longQuantity;
            let purchaseVal:number = item.positions[0].averagePrice * item.positions[0].longQuantity
            let netPercentDelta: number = Number((((currentVal-purchaseVal)/purchaseVal)*100).toFixed(2))
            return (
                <DataTable.Row key={item.underlyingSymbol} style={{paddingLeft:48}}>
                <DataTable.MultiRowCell 
                    mainText={item.underlyingSymbol} 
                    subText={(item.positions[0].shortQuantity || item.positions[0].longQuantity ?'+' : '-') + (item.positions[0].shortQuantity || item.positions[0].longQuantity)}
                    subDirection={(item.positions[0].shortQuantity > item.positions[0].longQuantity ? -1 : 1)}
                />
                <DataTable.MultiRowCell numeric
                    mainText={parseValue(allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Mark])}
                    subText={parseValuePercent(UnderlyingPercentDelta)}
                    subDirection={getDirection(UnderlyingPercentDelta)}
                />   
                <DataTable.MultiRowCell numeric
                    mainText={parseValue(currentVal)}
                    subText={parseValuePercent(netPercentDelta)}
                    subDirection={getDirection(netPercentDelta)}
                />                 
                </DataTable.Row>
            )
        }
        else{
            var testVar = 0;

            
            let sum = item.positions.reduce((res, pos)=> {
                return {
                    purchaseVal:( res.purchaseVal ) + Number(pos.averagePrice * (pos.longQuantity || pos.shortQuantity) * (allEntities?.[pos.symbol]?.[optionFieldMap.Multiplier]) * (pos.longQuantity > pos.shortQuantity ? 1 : -1)), 
                    currentVal:( res.currentVal ) + Number(allEntities?.[pos.symbol]?.[optionFieldMap.Mark] * (pos.longQuantity || pos.shortQuantity)) * allEntities?.[pos.symbol]?.[optionFieldMap.Multiplier]
                }
            }, {purchaseVal: 0, currentVal: 0})

            let totalPercentDelta: number = Number((((sum.currentVal-sum.purchaseVal)/sum.purchaseVal)*100).toFixed(2))

            return (
                <DataTable.Accordion 
                key={item.underlyingSymbol}
                mainRow={                    
                    <DataTable.Row key={0} >
                    <DataTable.Cell>{item.underlyingSymbol}</DataTable.Cell>
                    <DataTable.MultiRowCell numeric
                        mainText={parseValue(allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Mark])}
                        subText={parseValuePercent(UnderlyingPercentDelta)}
                        subDirection={getDirection(UnderlyingPercentDelta)}
                    />                    
                    <DataTable.MultiRowCell numeric mainText={`$${sum.currentVal.toFixed(2)}`} mainDirection={0} subText={parseValuePercent(totalPercentDelta)} subDirection={getDirection(totalPercentDelta)}/>
                    </DataTable.Row>
                }>
                    {item.positions.map((sub) => {
                        let OptionPercentDelta = (((allEntities?.[sub.symbol]?.[optionFieldMap.Mark]-allEntities?.[sub.symbol]?.[optionFieldMap.Close])/allEntities?.[sub.symbol]?.[optionFieldMap.Close] ) * 100 * (sub.longQuantity > sub.shortQuantity ? 1 : -1)).toFixed(2) || 0
                        //console.log(JSON.stringify(sub))

                        if (sub.assetType == 'EQUITY'){
                            <DataTableRow key={`${item.underlyingSymbol}_${sub.symbol}`}>
                                <DataTableCell>{sub.symbol}</DataTableCell>
                            </DataTableRow>
                        }
                        else {

                            let currentVal:number = Number(allEntities?.[sub.symbol]?.[optionFieldMap.Mark] * (sub.longQuantity || sub.shortQuantity)) * allEntities?.[sub.symbol]?.[optionFieldMap.Multiplier]
                            let purchaseVal:number = Number(sub.averagePrice * (sub.longQuantity || sub.shortQuantity) * (allEntities?.[sub.symbol]?.[optionFieldMap.Multiplier]) * (sub.longQuantity > sub.shortQuantity ? 1 : -1)) 
                            let netPercentDelta: number = Number((((currentVal-purchaseVal)/purchaseVal)*100).toFixed(2))
                            //console.log(`${sub.symbol} ${allEntities?.[sub.symbol]?.[optionFieldMap.Mark]} * ${(sub.longQuantity || sub.shortQuantity)} * ${allEntities?.[sub.symbol]?.[optionFieldMap.Multiplier]}`)
                            //console.log(`${sub.symbol} ${currentVal} - ${purchaseVal}`)
                            return (
                            <DataTable.Row key={`${item.underlyingSymbol}_${sub.symbol}`}>
                            <DataTable.MultiRowCell 
                                mainText={sub.description}
                                subText={(sub.longQuantity > sub.shortQuantity ?'+' : '-') + (sub.shortQuantity || sub.longQuantity)}
                                subDirection={sub.longQuantity > sub.shortQuantity ? 1: -1}
                            />
                            <DataTable.MultiRowCell numeric
                                mainText={parseValue(allEntities?.[sub.symbol]?.[optionFieldMap.Mark])}
                                subText={parseValuePercent(OptionPercentDelta)}
                                subDirection={getDirection(OptionPercentDelta)}
                            /> 
                            <DataTable.MultiRowCell numeric
                                mainText={parseValue(currentVal)}
                                subText={parseValuePercent(netPercentDelta)}
                                subDirection={getDirection(netPercentDelta)}
                            /> 
                            </DataTable.Row>
                        )}
                    })}
                </DataTable.Accordion>
            )
        }
    })


    return(
        <View style={{flex:1,  backgroundColor: Colors.MainDark}}>


            <Appbar.Header
                statusBarHeight={0} 
                style={{backgroundColor: Colors.MainDark}}>
                <Appbar.Content
                    title='Account'
                />
                <Menu
                    visible={visible}
                    statusBarHeight={0}
                    style={{backgroundColor: Colors.SecondaryDark}}
                    contentStyle={{backgroundColor: Colors.SecondaryDark}}
                    anchor={
                        <Appbar.Action icon="dots-vertical"
                            onPress={()=> setVisible(true)}
                            color={Colors.TextLight}
                        />
                    }
                    onDismiss={() => setVisible(false)}>
                        <Menu.Item 
                            title='Debug'
                            onPress={() => printDebug()}
                        />
                        <Menu.Item 
                            title='Log Out'
                            onPress={() => onLogout()}
                        />
                    </Menu>
            </Appbar.Header>

        <ScrollView stickyHeaderIndices={[1]}>
            <Card>
                <Card.Title title="Account Value"/>
                <Card.Content>
                    <Title>$69,420.00</Title>
                    <Paragraph>+1000%</Paragraph>
                </Card.Content>
            </Card>
            <DataTable >
                <DataTable.Header style={{backgroundColor:Colors.MainDark, paddingLeft:48}}>
                    <DataTable.Title>Symbol</DataTable.Title>
                    <DataTable.Title numeric>Mark</DataTable.Title>
                    <DataTable.Title numeric>Value</DataTable.Title>
                </DataTable.Header>
            </DataTable>
            <DataTable style={{flex:1}}>
                {positionRows}
            </DataTable>
            </ScrollView>
        </View>
    )
    


}