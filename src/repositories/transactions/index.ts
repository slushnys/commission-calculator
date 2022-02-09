import type { Clients } from './types'

export async function getMonthlyTransactionValue({
    clientId,
    clients,
    date,
}: {
    clientId: string
    clients: Clients
    date: string
}) {
    const currentMonth = new Date(date).getMonth() + 1
    return Promise.resolve(
        clients
            .filter((client) => client.clientId === clientId && client.month === currentMonth)
            .reduce<number>((previousValue, currentValue) => previousValue + currentValue.amount, 0)
    )
}
