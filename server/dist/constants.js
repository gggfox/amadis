"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORGOT_PASSWORD_PREFIX = exports.SESSION_SECRET = exports.SERVER_PORT = exports.CLIENT_NAME = exports.COOKIE_NAME = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.COOKIE_NAME = 'qid';
exports.CLIENT_NAME = 'http://localhost:3001';
exports.SERVER_PORT = 4002;
exports.SESSION_SECRET = 'hjfghjfgjhdtypedro';
exports.FORGOT_PASSWORD_PREFIX = 'forgot-password:';
//# sourceMappingURL=constants.js.map