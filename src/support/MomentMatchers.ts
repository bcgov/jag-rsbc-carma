import MatcherUtils = jest.MatcherUtils;
import moment, { Moment } from "moment";
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'


export declare type JestResult = {
    message: () => string;
    pass: boolean;
};

export function momentIsSame<T>(this: MatcherUtils, actual: T, expected: T): JestResult {
    const pass = moment(actual).isSame(moment(expected));
    return {
        message: () => pass ? '' :
            `${matcherHint('.momentIsSame')}\n` +
            `\n` +
            `Received:\n` +
            `  ${printReceived(actual)}\n` +
            `Expected:\n` +
            `  ${printExpected(expected)}\n`,
        pass,
    }
}

const dateFormat = "YYYY-MM-DD";

export function toBeSameDate<T>(this: MatcherUtils, actual: T, expected: T): JestResult {
    
    const actualDate = moment(actual).format(dateFormat);
    const expectedDate = moment(expected).format(dateFormat)
    const pass = actualDate === expectedDate;
    return {
        message: () => pass ? '' :
            `${matcherHint('.toBeSameDate')}\n` +
            `\n` +
            `Received:\n` +
            `  ${printReceived(actualDate)} ('${actual}')\n` +
            `Expected:\n` +
            `  ${printExpected(expectedDate)} ('${expected}')\n`,
        pass,
    }
}

declare global {
    namespace jest {
        interface Matchers<R> {
            momentIsSame(expected: Moment | string | number | undefined): R, // tslint:disable-line:no-any
            toBeSameTime(expected: Moment | string | number | undefined): R, // tslint:disable-line:no-any
            toBeSameDate(expected: Moment | string | number | undefined): R, // tslint:disable-line:no-any
        }
    }
}

expect.extend({
    momentIsSame,
    toBeSameDate
});