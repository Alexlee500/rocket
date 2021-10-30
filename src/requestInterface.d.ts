declare interface Request {
    id: number,
    requestType: "History" |  "Equity",
    symbol?: string,
    period?: string, 
    frequency?: string
}