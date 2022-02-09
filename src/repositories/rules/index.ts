import { RuleTypes } from '../../domain/constants'
import type {
    DefaultPricingRule,
    HighTurnoverRule,
    ClientDiscountRule,
} from '../../domain/parser.type'

export async function getRules(clientId: string) {
    return await Promise.resolve([
        {
            commissionPercent: 0.005, // 0.5%
            commissionMinimum: 0.05,
            type: RuleTypes.DefaultPricing,
        } as DefaultPricingRule,
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
    ])
}
