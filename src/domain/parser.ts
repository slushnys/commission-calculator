import { RuleTypes } from './constants'
import type {
    DefaultPricingRule,
    ClientDiscountRule,
    HighTurnoverRule,
    CommissionRules,
} from './parser.type'

function chooseTransactionCost({
    transactionCost,
    calculatedFee,
}: {
    transactionCost?: number
    calculatedFee: number
}) {
    let commissionFee: number
    if (transactionCost === undefined) {
        commissionFee = calculatedFee
    } else {
        commissionFee = transactionCost > calculatedFee ? calculatedFee : transactionCost
    }
    return commissionFee
}

const defaultRule: DefaultPricingRule = {
    commissionPercent: 0.005, // 0.5%
    commissionMinimum: 0.05,
    type: RuleTypes.DefaultPricing,
}

export type RuleParser = ReturnType<typeof makeRuleParser>
export function makeRuleParser() {
    const existingRules: {
        defaultPricing?: DefaultPricingRule
        clientDiscount?: ClientDiscountRule
        highTurnover?: HighTurnoverRule
    } = {}
    function parse({
        rules = [defaultRule],
        clientId,
        transactionValue,
        monthlyTransactionValue,
    }: {
        rules: CommissionRules[]
        clientId: string
        transactionValue: number
        monthlyTransactionValue: number
    }) {
        let transactionCost: number | undefined = undefined
        for (const rule of rules) {
            // 1st rule
            if (rule.type === 'defaultPricing') {
                let calculatedFee: number
                const previousRule = existingRules[rule.type]
                const currentRuleFee = rule.commissionPercent * transactionValue
                // const currentRuleCommission = rule.commissionPercent * transactionValue
                // const previousRuleCommission =
                // previousRule === undefined
                //     ? undefined
                //     : previousRule.commissionPercent * transactionValue
                // let { fee:calculatedFee , rule: ruleToAdd} = calculateFeeWithNewRole({previousRule, currentRule: rule, previousRuleCommission, currentRuleCommission})
                // const previousCommission = previousRule.commissionPercent * transactionValue
                // rulesToBeApplied[rule.type] = ruleToAdd

                if (previousRule !== undefined) {
                    const previousCommission = previousRule.commissionPercent * transactionValue
                    const isPreviousLarger = previousCommission > currentRuleFee
                    calculatedFee = isPreviousLarger ? currentRuleFee : previousCommission
                    const insertedRule = (existingRules[rule.type] = isPreviousLarger
                        ? rule
                        : previousRule)

                    calculatedFee =
                        calculatedFee < insertedRule.commissionMinimum
                            ? insertedRule.commissionMinimum
                            : calculatedFee
                } else {
                    calculatedFee = currentRuleFee
                    existingRules[rule.type] = rule
                }

                transactionCost = chooseTransactionCost({ transactionCost, calculatedFee })
            }
            // 2nd rule
            if (rule.type === 'clientDiscount') {
                if (rule.clientId === clientId) {
                    const previousRule = existingRules[rule.type]
                    let calculatedFee: number
                    const currentRuleFee = rule.commissionMinimum

                    if (previousRule !== undefined) {
                        const previousCommission = previousRule.commissionMinimum
                        const isPreviousLarger = previousCommission > currentRuleFee
                        calculatedFee = isPreviousLarger ? currentRuleFee : previousCommission
                        existingRules[rule.type] = isPreviousLarger ? rule : previousRule
                    } else {
                        calculatedFee = currentRuleFee
                        existingRules[rule.type] = rule
                    }

                    transactionCost = chooseTransactionCost({ transactionCost, calculatedFee })
                }
            }

            // 3rd rule
            if (rule.type === 'highTurnover') {
                if (rule.applyAfter <= monthlyTransactionValue) {
                    const previousRule = existingRules[rule.type]
                    let calculatedFee: number
                    const currentRuleFee = rule.commissionMinimum

                    if (previousRule !== undefined) {
                        const previousCommission = previousRule.commissionMinimum
                        const isPreviousLarger = previousCommission > currentRuleFee
                        calculatedFee = isPreviousLarger ? currentRuleFee : previousCommission
                        existingRules[rule.type] = isPreviousLarger ? rule : previousRule
                    } else {
                        calculatedFee = currentRuleFee
                        existingRules[rule.type] = rule
                    }

                    transactionCost = chooseTransactionCost({ transactionCost, calculatedFee })
                }
            }
        }
        // TODO: make sure its not undefined
        return transactionCost
    }
    return {
        parse,
    }
}
