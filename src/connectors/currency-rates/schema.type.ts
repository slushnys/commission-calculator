export interface RatesResponse {
    motd: Record<string, string>
    success: true
    historical: true
    base: string
    date: string
    rates: Record<string, number>
}
