import  {Text, View, Button } from 'react-native';
import * as tda from '../api/AmeritradeApi';

export default function PromptLoginScreen() {

    let tdaLogin = async() => {
        console.log('TDA Login');
        await tda.oauthApiLogin();
    }

    return (
        <View>
            <Button 
                title="Log in With TD Ameritrade"
                onPress={() => tdaLogin()}
            />
        </View>
    )


}