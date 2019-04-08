/// <reference types="jest" />
import MatcherUtils = jest.MatcherUtils;
import { Moment } from "moment";
export declare type JestResult = {
    message: () => string;
    pass: boolean;
};
export declare function momentIsSame<T>(this: MatcherUtils, actual: T, expected: T): JestResult;
export declare function toBeSameDate<T>(this: MatcherUtils, actual: T, expected: T): JestResult;
declare global {
    namespace jest {
        interface Matchers<R> {
            momentIsSame(expected: Moment | string | number | undefined): R;
            toBeSameTime(expected: Moment | string | number | undefined): R;
            toBeSameDate(expected: Moment | string | number | undefined): R;
        }
    }
}
