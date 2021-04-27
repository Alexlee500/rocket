import React, { useEffect } from 'react';
import  {Text, View, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { send } from '@giantmachines/redux-websocket';

import { clearTokens, selectUserPrincipals } from '../Redux/features/tdaSlice';
import { LogoutRequest } from '../api/AmeritradeSockRequests';
import { deauthenticate } from '../Redux/features/authSlice';

export default function AccountScreen() {
    const dispatch = useDispatch();
    const PrincipalData = useSelector( selectUserPrincipals )
    let onLogout = () => {
        dispatch(deauthenticate())
        dispatch(send(LogoutRequest(PrincipalData)));
    }
    return(
        <View>

            <Text>Account</Text>
            <Button
                title="Log Out"
                onPress={() => onLogout()}
            />
        </View>
    )
    


}