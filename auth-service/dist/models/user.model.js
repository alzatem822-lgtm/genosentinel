"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = void 0;
const toUserResponse = (user) => {
    return {
        id: user.id,
        email: user.email,
        verified: user.verified,
        created_at: user.created_at
    };
};
exports.toUserResponse = toUserResponse;
