import { Currency } from "../hooks/AccountsContext"

const getCost = (currency: Currency) => {
    switch (currency) {
        case Currency.USD:
            return 1
        case Currency.KZT:
            return 0.0023395643731137263
        case Currency.EUR:
            return 1.2195121951219512
        default:
            throw new Error("not implemented");
    }
}

const normalize = (amount: number, currency: Currency) => {
    return amount * getCost(currency)
}

export {
    getCost,
    normalize
}