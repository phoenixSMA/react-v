export enum ServerEvents {
    CONNECTED = 'connected',
    DISCONNECTED = 'connect_error',
    TRADER_STATUS_CHANGED = 'trader_status_changed',
}

export enum ClientEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    SET_TRADER = 'set_trader',
    CHANGE_TRADER_STATUS = 'change_trader_status',
}
