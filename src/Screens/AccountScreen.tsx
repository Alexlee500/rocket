import React, { useEffect } from 'react';
import  {Text, View, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { connect, send, disconnect } from '@alexlee500/redux-websocket/ReduxWebsocket'


import { resetConnections, selectAccountData, selectUserPrincipals } from '../Redux/features/tdaSlice';
import { LogoutRequest } from '../api/AmeritradeSockRequests';
import { quoteFieldMap, optionFieldMap } from '../api/AmeritradeHelper';

import { deauthenticate } from '../Redux/features/authSlice';
import { Appbar, List, Card, Title, Paragraph, Menu} from 'react-native-paper';
import * as cdUtils from '../utils/ChartDataUtils'
import * as ChartUtils from '../utils/ChartDataUtils'


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

    const reducePositions = (sum, pos) => {
        if (pos.assetType == "OPTION"){
            return {
                purchaseVal:( sum.purchaseVal ) + (Number(pos.averagePrice * (pos.longQuantity || pos.shortQuantity) * (allEntities?.[pos.symbol]?.[optionFieldMap.Multiplier]) * (pos.longQuantity > pos.shortQuantity ? 1 : -1)) || 0), 
                currentVal:( sum.currentVal ) + (Number( allEntities?.[pos.symbol]?.[optionFieldMap.Mark] * (pos.longQuantity || pos.shortQuantity) * allEntities?.[pos.symbol]?.[optionFieldMap.Multiplier] * (pos.longQuantity > pos.shortQuantity ? 1 : -1)) || 0),
                closeVal:( sum.closeVal ) + (Number( allEntities?.[pos.symbol]?.[optionFieldMap.Close] * (pos.longQuantity || pos.shortQuantity) * allEntities?.[pos.symbol]?.[optionFieldMap.Multiplier] * (pos.longQuantity > pos.shortQuantity ? 1 : -1)) || 0)
            }
        }
        else return {
            purchaseVal:( sum.purchaseVal ) + (Number(pos.averagePrice * (pos.longQuantity || pos.shortQuantity) * (pos.longQuantity > pos.shortQuantity ? 1 : -1)) || 0), 
            currentVal:( sum.currentVal ) + (Number(allEntities?.[pos.symbol]?.[quoteFieldMap.Mark] * (pos.longQuantity || pos.shortQuantity)) || 0),
            closeVal:( sum.closeVal ) + (Number(allEntities?.[pos.symbol]?.[quoteFieldMap.Close] * (pos.longQuantity || pos.shortQuantity)) || 0)
        }
    }

    const accountValues = accountPositions.reduce((sum, item) => {
        let itemSum = item.positions.reduce( reducePositions, {currentVal: 0, purchaseVal: 0, closeVal: 0})
        return {
            currentVal: sum.currentVal + itemSum.currentVal,
            purchaseVal: sum.purchaseVal + itemSum.purchaseVal,
            closeVal: sum.closeVal + itemSum.closeVal
        }
    }, {currentVal: AccountData.securitiesAccount.initialBalances.cashBalance, purchaseVal: 0, closeVal: AccountData.securitiesAccount.initialBalances.cashBalance})

    const currentDayPL = AccountData.securitiesAccount.positions.reduce((sum, item) => {
        console.log(item)
        return sum + item.currentDayProfitLoss;
    }, 0)

    console.log(accountValues.currentVal)

    const currentDayPLPercent = cdUtils.percentDelta(accountValues.closeVal, accountValues.currentVal, 2);
    
    console.log(currentDayPLPercent)



    const positionRows = accountPositions.map((item) => {
        let Mark = allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Mark];
        let Close = allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Close];

        //let UnderlyingPercentDelta:number = Number((((Mark - Close) / Close) * 100).toFixed(2))
        let UnderlyingPercentDelta: number = ChartUtils.percentDelta(Close, Mark, 2)
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
                    mainText={cdUtils.valueToString(allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Mark])}
                    subText={cdUtils.percentToString(UnderlyingPercentDelta)}
                    subDirection={cdUtils.getDirection(UnderlyingPercentDelta)}
                />   
                <DataTable.MultiRowCell numeric
                    mainText={cdUtils.valueToString(currentVal)}
                    subText={cdUtils.percentToString(netPercentDelta)}
                    subDirection={cdUtils.getDirection(netPercentDelta)}
                />                 
                </DataTable.Row>
            )
        }
        else{

            let sum = item.positions.reduce(reducePositions, {purchaseVal: 0, currentVal: 0})
            let totalPercentDelta: number = Number((((sum.currentVal-sum.purchaseVal)/sum.purchaseVal)*100).toFixed(2))

            return (
                <DataTable.Accordion 
                key={item.underlyingSymbol}
                mainRow={                    
                    <DataTable.Row key={0} >
                    <DataTable.Cell>{item.underlyingSymbol}</DataTable.Cell>
                    <DataTable.MultiRowCell numeric
                        mainText={cdUtils.valueToString(allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Mark])}
                        subText={cdUtils.percentToString(UnderlyingPercentDelta)}
                        subDirection={cdUtils.getDirection(UnderlyingPercentDelta)}
                    />                    
                    <DataTable.MultiRowCell numeric 
                        mainText={cdUtils.valueToString(sum.currentVal)} 
                        subText={cdUtils.percentToString(totalPercentDelta)} 
                        subDirection={cdUtils.getDirection(totalPercentDelta)}/>
                    </DataTable.Row>
                }>
                    {item.positions.map((sub) => {
                        let OptionPercentDelta = (((allEntities?.[sub.symbol]?.[optionFieldMap.Mark]-allEntities?.[sub.symbol]?.[optionFieldMap.Close])/allEntities?.[sub.symbol]?.[optionFieldMap.Close] ) * 100 * (sub.longQuantity > sub.shortQuantity ? 1 : -1)).toFixed(2) || 0

                        if (sub.assetType == 'EQUITY'){
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
                                    mainText={cdUtils.valueToString(allEntities?.[item.underlyingSymbol]?.[quoteFieldMap.Mark])}
                                    subText={cdUtils.percentToString(UnderlyingPercentDelta)}
                                    subDirection={cdUtils.getDirection(UnderlyingPercentDelta)}
                                />   
                                <DataTable.MultiRowCell numeric
                                    mainText={cdUtils.valueToString(currentVal)}
                                    subText={cdUtils.percentToString(netPercentDelta)}
                                    subDirection={cdUtils.getDirection(netPercentDelta)}
                                />                 
                                </DataTable.Row>
                            )
                        }
                        else {

                            let currentVal:number = Number(allEntities?.[sub.symbol]?.[optionFieldMap.Mark] * (sub.longQuantity || sub.shortQuantity) * allEntities?.[sub.symbol]?.[optionFieldMap.Multiplier]  * (sub.longQuantity > sub.shortQuantity ? 1 : -1))
                            let purchaseVal:number = Number(sub.averagePrice * (sub.longQuantity || sub.shortQuantity) * (allEntities?.[sub.symbol]?.[optionFieldMap.Multiplier]) * (sub.longQuantity > sub.shortQuantity ? 1 : -1)) 
                            let netPercentDelta: number = Number((((currentVal-purchaseVal)/purchaseVal)*100).toFixed(2))
                            return (
                            <DataTable.Row key={`${item.underlyingSymbol}_${sub.symbol}`}>
                            <DataTable.MultiRowCell 
                                mainText={cdUtils.formatOptionTitle(sub.description, item.underlyingSymbol)}
                                subText={(sub.longQuantity > sub.shortQuantity ?'+' : '-') + cdUtils.formatNumberString(sub.shortQuantity || sub.longQuantity)}
                                subDirection={sub.longQuantity > sub.shortQuantity ? 1: -1}
                            />
                            <DataTable.MultiRowCell numeric
                                mainText={cdUtils.valueToString(allEntities?.[sub.symbol]?.[optionFieldMap.Mark])}
                                subText={cdUtils.percentToString(OptionPercentDelta)}
                                subDirection={cdUtils.getDirection(OptionPercentDelta)}
                            /> 
                            <DataTable.MultiRowCell numeric
                                mainText={cdUtils.valueToString(currentVal)}
                                mainDirection={cdUtils.getDirection(currentVal)}
                                subText={cdUtils.percentToString(netPercentDelta)}
                                subDirection={cdUtils.getDirection(netPercentDelta)}
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
                    <Title>{cdUtils.valueToString(accountValues.currentVal)}</Title>
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