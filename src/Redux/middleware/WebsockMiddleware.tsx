export default createWebsockMiddleware

export const ActionTypes = {
    WS_OPEN: 'Websock::Open',
    WS_CLOSED: 'Websock::Closed',
    WS_ERROR: 'Websock::Error',
    WS_SEND: 'Websock::Send'
}

export const connect = host =>({ type: ActionTypes.WS_OPEN, host});
export const send = message => ({type: ActionTypes.WS_SEND, message})

export function createWebsockMiddleware(){
    let socket = null;

    const onOpen = store => (event) => {
        console.log(`Sock Open ${JSON.stringify(event)}`)

        //store.dispatch(connect(event))

    }

    const onClose = store => (event) => {
        console.log(`close ${JSON.stringify(event)}`)
        //store.dispatch(ActionTypes.WS_CLOSED)
    }

    const onMessage = store => (event) => {
        console.log('onMessage')
        //store.dispatch(ActionTypes.WS_SEND)
    }

    return store => next => action => {
        switch (action.type){
            case 'Websock::Open':
                console.log('open')
                if (socket !== null ){
                    socket.close()
                }
                console.log(action.host)
                socket = new WebSocket(action.host)
                socket.onmessage = onMessage(store)
                socket.onclose = onClose(store)
                socket.onopen = onOpen(store)
                break
            case 'Websock::Closed':
                if (socket !== null){
                    socket.close()
                }
                socket = null
                break                
            case 'Websock::Send':
                console.log(`sock Send ${action.message}`)
                socket.send(action.message)
                break;
            default:
                return next(action);
        }
    }
}