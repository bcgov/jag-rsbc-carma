"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./environment"); // Must be first
var app_1 = __importDefault(require("./app"));
var PORT = process.env.PORT || 3001;
app_1.default.listen(PORT).on('listening', function () {
    console.log("Carma API started on port " + PORT + "...");
    console.log("DATE: " + new Date().toString());
});
//# sourceMappingURL=C:/Dev/jag-rsbc-carma/dist/index.js.map