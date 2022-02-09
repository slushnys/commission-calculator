import { Context } from 'aws-lambda'
import { handler } from '.'

jest.mock('../../connectors/currency-rates', () => {
    return {
        makeCurrencyConnector: () => {
            return {
                getExchangeRates: Promise.resolve(1),
            }
        },
    }
})
describe('test handler', () => {
    it('test full handler lifecycle', async () => {
        const requestData = { client_id: '1', amount: 500, date: '2022-01-01', currency: 'EUR' }
        const response = await handler(
            { body: JSON.stringify(requestData) },
            {} as Context,
            () => ({})
        )
        expect(response).toMatchInlineSnapshot(`
            Object {
              "body": "{\\"amount\\":2.5,\\"currency\\":\\"EUR\\"}",
              "statusCode": 200,
            }
        `)
    })
})
