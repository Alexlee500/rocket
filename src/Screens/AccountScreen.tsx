import React, { useEffect } from 'react';
import  {Text, View, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { send, disconnect  } from '@giantmachines/redux-websocket';

import { resetConnections, selectAccountData, selectUserPrincipals } from '../Redux/features/tdaSlice';
import { LogoutRequest } from '../api/AmeritradeSockRequests';
import { deauthenticate } from '../Redux/features/authSlice';
import { Appbar, List, Card, Title, Paragraph} from 'react-native-paper';


import Colors from '../configs/Colors'
import  DataTable from '../Components/DataTable/DataTable'
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';


export default function AccountScreen() {
    const dispatch = useDispatch();
    const PrincipalData = useSelector( selectUserPrincipals )
    const AccountData:SecuritiesAccount = useSelector(selectAccountData)
    const [accountPositions, setAccountPositions] = React.useState([]);

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
        /*
        let posLst = AccountData.securitiesAccount.positions.map((item) => {
            return item.instrument.underlyingSymbol || item.instrument.symbol
        })

        let symbols = AccountData.securitiesAccount.positions.map((item) => {
            return {
                underlyingSymbol: item.instrument.underlyingSymbol || item.instrument.symbol,
                symbol: item.instrument.symbol,
                putCall: item.instrument.putCall,
                shortQuantity: item.shortQuantity,
                longQuantity: item.longQuantity,
                averagePrice: item.averagePrice

            }
        })

        let accountSymbols = [...new Set(posLst)].sort();


        console.log(accountSymbols)
        
        let res = accountSymbols.map((sym) => {
            return {
                underlying: sym,
                positions: symbols.filter((symbols) => {return symbols.underlyingSymbol === sym ? sym : null})
            }
        })

        console.log(JSON.stringify(res))
        setAccountPositions(res);
        
        */
    }, [AccountData])

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
    

    const positionRows = accountPositions.map((item) => {

        if (item.positions.length == 1 && item.positions[0].assetType == 'EQUITY'){

            return (
                <DataTable.Row key={item.underlyingSymbol} style={{paddingLeft:48}}>
                <DataTable.MultiRowCell 
                    mainText={item.underlyingSymbol} 
                    subText={(item.positions[0].shortQuantity || item.positions[0].longQuantity ?'+' : '-') + (item.positions[0].shortQuantity || item.positions[0].longQuantity)}
                    subDirection={(item.positions[0].shortQuantity > item.positions[0].longQuantity ? -1 : 1)}
                />
                <DataTable.Cell numeric>1</DataTable.Cell>
                <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
            )
        }
        else{
            return (
                <DataTable.Accordion 
                key={item.underlyingSymbol}
                mainRow={                    
                    <DataTable.Row key={0} >
                    <DataTable.Cell>{item.underlyingSymbol}</DataTable.Cell>
                    <DataTable.MultiRowCell numeric mainText="$150.69" subText="+12.2%" subDirection={1}/>
                    <DataTable.MultiRowCell numeric mainText="$10000" mainDirection={1} subText="+34.2%" subDirection={1}/>
                    </DataTable.Row>
                }>
                    {item.positions.map((sub) => {
                        if (sub.assetType == 'EQUITY'){
                            return null
                        }
                        else return (
                            <DataTable.Row key={`${item.underlyingSymbol}_${sub.symbol}`}>
                            <DataTable.MultiRowCell 
                                mainText={sub.description}
                                subText={(sub.longQuantity > sub.shortQuantity ?'+' : '-') + (sub.shortQuantity || sub.longQuantity)}
                                subDirection={sub.longQuantity > sub.shortQuantity ? 1: -1}
                            />
                            <DataTable.Cell numeric>c1</DataTable.Cell>
                            <DataTable.Cell numeric>c2</DataTable.Cell>
                            </DataTable.Row>
                        )
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
                    <DataTable.Title numeric>P&L</DataTable.Title>
                </DataTable.Header>
            </DataTable>
            <DataTable style={{flex:1}}>
                {positionRows}
            </DataTable>
            </ScrollView>
        </View>
    )
    


}