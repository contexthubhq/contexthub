"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const react_1 = __importDefault(require("react"));
const google_1 = require("next/font/google");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'ContextHub',
    description: 'Context management platform for AI applications.',
};
function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>);
}
