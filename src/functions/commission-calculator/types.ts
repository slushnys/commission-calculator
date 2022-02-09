export interface Event {
    body: string
}
export interface CommissionCalculatorRequest {
    date: string
    amount: number
    currency: string
    client_id: string
}

export interface CommissionCalculatorResponse {
    statusCode: number
    body: string
}
