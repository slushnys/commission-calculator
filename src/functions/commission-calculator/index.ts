import { makeCurrencyConnector } from '../../connectors/currency-rates'
import { makeRuleParser } from '../../domain/parser'
import { makeCommissionCalculator } from './commision-calculator'
import type { Handler } from 'aws-lambda'
import { commissionInputSchema, commissionResponseSchema } from './schema'
import type { CommissionCalculatorResponse, CommissionCalculatorRequest, Event } from './types'
import type { Clients } from '../../repositories/transactions/types'

// fake database
const clients: Clients = []

type EventHandler = Handler<Event, CommissionCalculatorResponse>
export const handler: EventHandler = async ({ body }: Event) => {
    let parsedBody: CommissionCalculatorRequest
    try {
        parsedBody = JSON.parse(body) as CommissionCalculatorRequest
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Couldnt parse the body' }),
        }
    }
    const { error } = commissionInputSchema.validate(parsedBody)
    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Data passed was invalid' }),
        }
    }
    const { client_id: clientId, amount, currency, date } = parsedBody
    const currencyRateConnector = makeCurrencyConnector()
    const ruleParser = makeRuleParser()

    const commissionCalculator = makeCommissionCalculator({
        currencyRateConnector,
        ruleParser,
        clients,
    })
    const commission = await commissionCalculator({ clientId, amount, currency, date })
    const response = { amount: commission, currency: 'EUR' }

    const { error: responseSchemaError } = commissionResponseSchema.validate(response)
    if (responseSchemaError) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Trouble in the paradise to give you a response' }),
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(response),
    }
}
