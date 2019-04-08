"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var jest_matcher_utils_1 = require("jest-matcher-utils");
function momentIsSame(actual, expected) {
    var pass = moment_1.default(actual).isSame(moment_1.default(expected));
    return {
        message: function () { return pass ? '' :
            jest_matcher_utils_1.matcherHint('.momentIsSame') + "\n" +
                "\n" +
                "Received:\n" +
                ("  " + jest_matcher_utils_1.printReceived(actual) + "\n") +
                "Expected:\n" +
                ("  " + jest_matcher_utils_1.printExpected(expected) + "\n"); },
        pass: pass,
    };
}
exports.momentIsSame = momentIsSame;
var dateFormat = "YYYY-MM-DD";
function toBeSameDate(actual, expected) {
    var actualDate = moment_1.default(actual).format(dateFormat);
    var expectedDate = moment_1.default(expected).format(dateFormat);
    var pass = actualDate === expectedDate;
    return {
        message: function () { return pass ? '' :
            jest_matcher_utils_1.matcherHint('.toBeSameDate') + "\n" +
                "\n" +
                "Received:\n" +
                ("  " + jest_matcher_utils_1.printReceived(actualDate) + " ('" + actual + "')\n") +
                "Expected:\n" +
                ("  " + jest_matcher_utils_1.printExpected(expectedDate) + " ('" + expected + "')\n"); },
        pass: pass,
    };
}
exports.toBeSameDate = toBeSameDate;
expect.extend({
    momentIsSame: momentIsSame,
    toBeSameDate: toBeSameDate
});
//# sourceMappingURL=C:/Dev/carma-api/dist/support/MomentMatchers.js.map