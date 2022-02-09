import type { DefaultPricingRule } from './parser.type'

export enum RuleTypes {
    DefaultPricing = 'defaultPricing',
    HighTurnover = 'highTurnover',
    ClientDiscount = 'clientDiscount',
}

export const defaultRule: DefaultPricingRule = {
    commissionPercent: 0.005, // 0.5%
    commissionMinimum: 0.05,
    type: RuleTypes.DefaultPricing,
}
