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


export default function AccountScreen() {
    const dispatch = useDispatch();
    const PrincipalData = useSelector( selectUserPrincipals )
    const AccountData = useSelector(selectAccountData)

    console.log(JSON.stringify(AccountData))
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
                <DataTable.Accordion 
                    key={0}
                    mainRow={                    
                    <DataTable.Row key={0} >
                    <DataTable.MultiRowCell mainText="GME" subText="+100000" subDirection={1}/>
                    <DataTable.MultiRowCell numeric mainText="$150.69" subText="+12.2%" subDirection={1}/>
                    <DataTable.MultiRowCell numeric mainText="$10000" mainDirection={1} subText="+34.2%" subDirection={1}/>
                    </DataTable.Row>
                }>
                    <DataTable.Row key={0.1}>
                        <DataTable.Cell >Child 1</DataTable.Cell>
                        <DataTable.Cell numeric>c1</DataTable.Cell>
                        <DataTable.Cell numeric>c2</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row key={0.2}>
                        <DataTable.Cell >Child 2</DataTable.Cell>
                        <DataTable.Cell numeric>c1</DataTable.Cell>
                        <DataTable.Cell numeric>c2</DataTable.Cell>
                    </DataTable.Row>
                </DataTable.Accordion>
                <DataTable.Accordion 
                    key={1}
                    mainRow={                    
                    <DataTable.Row key={1.1}>
                        <DataTable.Cell >Main2</DataTable.Cell>
                        <DataTable.Cell numeric>1</DataTable.Cell>
                        <DataTable.Cell numeric>2</DataTable.Cell>
                    </DataTable.Row>
                }>
                    <DataTable.Row key={1.1}>
                        <DataTable.Cell >Child 1</DataTable.Cell>
                        <DataTable.Cell numeric>c1</DataTable.Cell>
                        <DataTable.Cell numeric>c2</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row key={1.2}>
                        <DataTable.Cell >Child 2</DataTable.Cell>
                        <DataTable.Cell numeric>c1</DataTable.Cell>
                        <DataTable.Cell numeric>c2</DataTable.Cell>
                    </DataTable.Row>
                </DataTable.Accordion>
                <DataTable.Row key={2} style={{paddingLeft:48}}>
                    <DataTable.MultiRowCell mainText="GME" subText="+100" subDirection={1}/>
                    <DataTable.MultiRowCell numeric mainText="GME" subText="+10" subDirection={1}/>
                    <DataTable.MultiRowCell numeric mainText="$10000" subText="13" subDirection={1}/>
                </DataTable.Row>
                <DataTable.Row key={3} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 3</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={4} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 4</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={5} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 5</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={6} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 6</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={7} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 7</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={8} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 8</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={9} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 9</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={10} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 10</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={11} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 11</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={12} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 12</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={13} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 13</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={14} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 14</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={15} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 15</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row key={16} style={{paddingLeft:48}}>
                    <DataTable.Cell >Test 16</DataTable.Cell>
                    <DataTable.Cell numeric>1</DataTable.Cell>
                    <DataTable.Cell numeric>2</DataTable.Cell>
                </DataTable.Row>
            </DataTable>
            </ScrollView>
        </View>
    )
    


}