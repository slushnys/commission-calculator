import { RuleTypes } from '../../domain/constants'
import type { HighTurnoverRule, ClientDiscountRule } from '../../domain/parser.type'

export async function getRules(clientId: string) {
    return await Promise.resolve([
        {
            type: RuleTypes.HighTurnover,
            applyAfter: 1000,
            commissionMinimum: 0.03,
        } as HighTurnoverRule,
        {
            type: RuleTypes.ClientDiscount,
            commissionMinimum: 0.05,
            clientId: '42',
        } as ClientDiscountRule,
        {
            type: RuleTypes.ClientDiscount,
            commissionMinimum: 0.06,
            clientId: '33',
        } as ClientDiscountRule,
        {
            type: RuleTypes.ClientDiscount,
            commissionMinimum: 0.02,
            clientId: '33',
        } as ClientDiscountRule,
        {
            type: RuleTypes.ClientDiscount,
            commissionMinimum: 0.08,
            clientId: '33',
        } as ClientDiscountRule,
    ])
}
