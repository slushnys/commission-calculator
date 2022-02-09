// import type { Got } from 'got'
// import got from 'got'

import type { AxiosInstance } from 'axios'
import axios from 'axios'
// const got = require('got')
import type { RatesResponse } from './schema.type'

export function makeGetExchangeRates(client: AxiosInstance) {
    return async function getExchangeRates(date = '2021-01-01') {
        const { data } = await client.get<RatesResponse>(date)
        // const { data } = await client.get(date).json<{ data: RatesResponse }>()

        return data
    }
}

export type CurrencyConnector = ReturnType<typeof makeCurrencyConnector>
export function makeCurrencyConnector() {
    // const client = got.extend({
    //     retry: {
    //         backoffLimit: 1.2, // TODO
    //         methods: ['GET'],
    //     },
    //     prefixUrl: 'https://api.exchangerate.host',
    // })
    const client = axios.create({ baseURL: 'https://api.exchangerate.host' })
    return {
        client,
        getExchangeRates: makeGetExchangeRates(client),
    }
}
