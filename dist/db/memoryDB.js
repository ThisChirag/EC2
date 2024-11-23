"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIVE_TOKENS = exports.BLOGS = exports.USERS = void 0;
exports.USERS = [];
exports.BLOGS = new Map();
exports.ACTIVE_TOKENS = new Map();
// prefer map than an object, if the cotent are dynamic;
// method do declare a map: const TODOS = new Map<string, Array<{ TodoId: number; Title: string; Description: string; Completed: boolean }>>()
// export const TODOS = new Map();
