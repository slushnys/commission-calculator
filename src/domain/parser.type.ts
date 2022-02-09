export interface DefaultPricingRule {
    commissionPercent: number
    commissionMinimum: number
    type: 'defaultPricing'
}

export interface ClientDiscountRule {
    type: 'clientDiscount'
    commissionMinimum: number
    clientId: string
}

export interface HighTurnoverRule {
    type: 'highTurnover'
    applyAfter: number
    commissionMinimum: number
}

export type CommissionRules = DefaultPricingRule | ClientDiscountRule | HighTurnoverRule
