import React, { useEffect } from 'react';
import  {Text, View, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { send, disconnect  } from '@giantmachines/redux-websocket';

import { resetConnections, selectUserPrincipals } from '../Redux/features/tdaSlice';
import { LogoutRequest } from '../api/AmeritradeSockRequests';
import { deauthenticate } from '../Redux/features/authSlice';
import { List } from 'react-native-paper';

export default function AccountScreen() {
    const dispatch = useDispatch();
    const PrincipalData = useSelector( selectUserPrincipals )
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
        <View style={{flex:1,  backgroundColor: '#342E38'}}>
            <Text>Account</Text>
            <Button
                title="Log Out"
                onPress={() => onLogout()}
            />

            <List.Section>
                <List.Accordion
                    title="Test Stonk aaaaaaaaaaaaaaaaaaaaaaaa11111111"
                >   
                <List.Item 
                    title="First item" 
                    />
                <List.Item title="Second item" />
                </List.Accordion>
                <List.Item title="test item" />
            </List.Section>
        </View>
    )
    


}