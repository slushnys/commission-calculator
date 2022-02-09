import type { CurrencyConnector } from '../../connectors/currency-rates'
import type { RuleParser } from '../../domain/parser'
import { getRules } from '../../repositories/rules'
import { getMonthlyTransactionValue } from '../../repositories/transactions'
import type { Clients } from '../../repositories/transactions/types'

export type CommissionCalculator = ReturnType<typeof makeCommissionCalculator>
export function makeCommissionCalculator({
    currencyRateConnector,
    ruleParser,
    clients,
}: {
    currencyRateConnector: CurrencyConnector
    ruleParser: RuleParser
    clients: Clients
}) {
    return async function commisionCalculator({
        amount,
        currency,
        clientId,
        date,
    }: {
        amount: number
        currency: string
        clientId: string
        date: string
    }) {
        let currentExchangeRate = 1
        if (currency !== 'EUR') {
            const { rates } = await currencyRateConnector.getExchangeRates(date)
            currentExchangeRate = rates[currency]
        }
        const exchangedAmount = amount * currentExchangeRate
        const rules = await getRules(clientId)
        const monthlyTransactionValue = await getMonthlyTransactionValue({
            clientId,
            clients,
            date,
        })
        const commissionAmount = ruleParser.parse({
            rules,
            clientId,
            transactionValue: exchangedAmount,
            monthlyTransactionValue,
        })
        const currentMonth = new Date(date).getMonth() + 1
        clients.push({ clientId, amount, month: currentMonth })

        return Number(commissionAmount?.toPrecision(2))
    }
}
