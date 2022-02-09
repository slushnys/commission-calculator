import { makeRuleParser } from '../../domain/parser'
import { makeCommissionCalculator } from './commision-calculator'
import { CurrencyConnector } from '../../connectors/currency-rates'
import { Clients } from '../../repositories/transactions/types'

describe('commission-calculator', () => {
    const currencyRateConnector = {
        getExchangeRates: async () => Promise.resolve(1),
    }
    const ruleParser = makeRuleParser()
    it('calculate commission for specific customer id 42', async () => {
        const amount = 2000
        const clientId = '42'
        const date = '2021-01-01'
        const currency = 'EUR'

        const clients: Clients = []
        const commissionCalculator = makeCommissionCalculator({
            clients,
            currencyRateConnector: currencyRateConnector as any as CurrencyConnector,
            ruleParser,
        })
        const commissionAmount = await commissionCalculator({ amount, clientId, currency, date })
        expect(commissionAmount).toMatchInlineSnapshot(`0.05`)
        const commissionAmount2 = await commissionCalculator({ amount, clientId, currency, date })
        expect(commissionAmount2).toMatchInlineSnapshot(`0.03`)
    })
    it('calculate commission for regular customer', async () => {
        const amount = 500
        const clientId = '1'
        const date = '2021-01-01'
        const currency = 'EUR'

        const clients: Clients = []
        const commissionCalculator = makeCommissionCalculator({
            clients,
            currencyRateConnector: currencyRateConnector as any as CurrencyConnector,
            ruleParser,
        })
        const commissionAmount = await commissionCalculator({ amount, clientId, currency, date })
        expect(commissionAmount).toMatchInlineSnapshot(`2.5`)
    })

    describe('multiple transactions test', () => {
        const clients: Clients = []

        it.each([
            ['42', '2021-01-02', 2000.0, 'EUR', 0.05],
            ['1', '2021-01-03', 500.0, 'EUR', 2.5],
            ['1', '2021-01-04', 499.0, 'EUR', 2.5],
            ['1', '2021-01-05', 100.0, 'EUR', 0.5],
            ['1', '2021-01-06', 1.0, 'EUR', 0.03],
            ['1', '2021-02-01', 500.0, 'EUR', 2.5],
            ['1', '2021-02-02', 500.0, 'EUR', 2.5],
            ['1', '2021-02-03', 500.0, 'EUR', 0.03],
            ['1', '2021-02-04', 500.0, 'EUR', 0.03],
            ['1', '2021-03-05', 500.0, 'EUR', 2.5],
            ['42', '2021-03-05', 1000.0, 'EUR', 0.05],
            ['42', '2021-03-05', 500.0, 'EUR', 0.03],
            ['33', '2021-03-05', 500.0, 'EUR', 0.02],
        ])(
            'tests transactions for client %s on date %s with amount %s (%s) expecting %s',
            async (clientId, date, amount, currency, expectedCommission) => {
                console.log('clients', clients)
                const commissionCalculator = makeCommissionCalculator({
                    clients,
                    currencyRateConnector: currencyRateConnector as any as CurrencyConnector,
                    ruleParser,
                })
                const commissionAmount = await commissionCalculator({
                    amount,
                    clientId,
                    currency,
                    date,
                })
                expect(commissionAmount).toEqual(expectedCommission)
            }
        )
    })
})
