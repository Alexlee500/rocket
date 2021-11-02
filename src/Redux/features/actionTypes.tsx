//@ts-ignore
import {
    WEBSOCKET_BROKEN,
    WEBSOCKET_CLOSED,
    WEBSOCKET_CONNECT,
    WEBSOCKET_DISCONNECT,
    WEBSOCKET_MESSAGE,
    WEBSOCKET_OPEN,
    WEBSOCKET_SEND   
    } from '@alexlee500/redux-websocket'

const WEBSOCKET_PREFIX = 'REDUX_WEBSOCKET'

export type WebsocketMessage = {
    type: typeof REDUX_WEBSOCKET_MESSAGE,
    payload: {
        message: string,
        origin: string
    }
}

export type WebsocketSend = {
    type: typeof REDUX_WEBSOCKET_MESSAGE,
    meta: {
        timestamp: Date
    }
    payload: string
}


export const REDUX_WEBSOCKET_BROKEN = `${WEBSOCKET_PREFIX}::${WEBSOCKET_BROKEN}`;
export const REDUX_WEBSOCKET_OPEN = `${WEBSOCKET_PREFIX}::${WEBSOCKET_OPEN}`;
export const REDUX_WEBSOCKET_CLOSED = `${WEBSOCKET_PREFIX}::${WEBSOCKET_CLOSED}`;
export const REDUX_WEBSOCKET_MESSAGE = `${WEBSOCKET_PREFIX}::${WEBSOCKET_MESSAGE}`;
export const REDUX_WEBSOCKET_CONNECT = `${WEBSOCKET_PREFIX}::${WEBSOCKET_CONNECT}`;
export const REDUX_WEBSOCKET_DISCONNECT = `${WEBSOCKET_PREFIX}::${WEBSOCKET_DISCONNECT}`;
export const REDUX_WEBSOCKET_SEND = `${WEBSOCKET_PREFIX}::${WEBSOCKET_SEND}`;