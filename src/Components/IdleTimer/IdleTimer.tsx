import React, {useEffect, useRef} from 'react'
import { View, PanResponder } from 'react-native';

type Props = {
    idleTimeout: number,
    onIdleAction?: ()=>void,
    children: React.ReactNode
}

function UseIdleTimer({idleTimeout, onIdleAction, children} : Props){

    var timer
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => {
                resetTimer();
                return true;
            },
            onStartShouldSetPanResponderCapture: () => {
                resetTimer();
                return false
            },

        })  
      ).current;
    
      
    function resetTimer(){
        clearTimeout(timer)
        timer = setTimeout(() => onIdle(), idleTimeout)
    }

    const onIdle = () => {
        onIdleAction()
    }
    
    useEffect(() => {
        resetTimer()
    }, [])
    return (
        <View {...panResponder.panHandlers} style={{flex:1}}>
            {children}
        </View>
    )
}

export default UseIdleTimer