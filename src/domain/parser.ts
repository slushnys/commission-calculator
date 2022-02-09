import { defaultRule, RuleTypes } from './constants'
import type { CommissionRules } from './parser.type'

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

export type RuleParser = ReturnType<typeof makeRuleParser>
export function makeRuleParser() {
    const existingRules = new Map<
        CommissionRules['type'],
        CommissionRules & { previousCommission: number }
    >()
    function calculateFee({
        ruleType,
        currentRule,
        currentRuleFee,
    }: {
        ruleType: CommissionRules['type']
        currentRule: CommissionRules
        currentRuleFee: number
    }) {
        let calculatedFee: number
        const previousRule = existingRules.has(ruleType) ? existingRules.get(ruleType) : undefined
        if (previousRule) {
            const { previousCommission } = previousRule
            const isPreviousLarger = previousCommission > currentRuleFee
            calculatedFee = isPreviousLarger ? currentRuleFee : previousCommission
            const bestRule = isPreviousLarger
                ? { ...currentRule, previousCommission: calculatedFee }
                : previousRule
            existingRules.set(ruleType, bestRule)
        } else {
            calculatedFee = currentRuleFee
            existingRules.set(ruleType, { ...currentRule, previousCommission: currentRuleFee })
        }
        return calculatedFee
    }
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
        // 1st and default rule which is always applied
        const defaultCommision = defaultRule.commissionPercent * transactionValue
        transactionCost =
            defaultCommision < defaultRule.commissionMinimum
                ? defaultRule.commissionMinimum
                : defaultCommision
        for (const rule of rules) {
            // 2nd rule
            if (rule.type === 'clientDiscount') {
                if (rule.clientId === clientId) {
                    const currentRuleFee = rule.commissionMinimum

                    const calculatedFee = calculateFee({
                        currentRule: rule,
                        currentRuleFee,
                        ruleType: rule.type,
                    })

                    transactionCost = chooseTransactionCost({ transactionCost, calculatedFee })
                }
            }

            // 3rd rule
            if (rule.type === 'highTurnover') {
                if (rule.applyAfter <= monthlyTransactionValue) {
                    const currentRuleFee = rule.commissionMinimum

                    const calculatedFee = calculateFee({
                        currentRule: rule,
                        currentRuleFee,
                        ruleType: rule.type,
                    })

                    transactionCost = chooseTransactionCost({ transactionCost, calculatedFee })
                }
            }
        }
        return transactionCost
    }
    return {
        parse,
    }
}
