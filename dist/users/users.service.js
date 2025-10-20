"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const api_exception_1 = require("../common/exceptions/api.exception");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    constructor() {
        this.users = [];
    }
    async create(email, username, password) {
        const existingUser = this.users.find((user) => user.email === email || user.username === username);
        if (existingUser) {
            throw new api_exception_1.UserAlreadyExistsException('Email hoặc username đã tồn tại');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: this.generateId(),
            email,
            username,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.users.push(newUser);
        return this.excludePassword(newUser);
    }
    async findByEmail(email) {
        return this.users.find((user) => user.email === email);
    }
    async findByUsername(username) {
        return this.users.find((user) => user.username === username);
    }
    async findById(id) {
        const user = this.users.find((user) => user.id === id);
        return user ? this.excludePassword(user) : undefined;
    }
    async findByEmailOrUsername(emailOrUsername) {
        return this.users.find((user) => user.email === emailOrUsername || user.username === emailOrUsername);
    }
    async validatePassword(user, password) {
        return bcrypt.compare(password, user.password);
    }
    async getAllUsers() {
        return this.users.map((user) => this.excludePassword(user));
    }
    excludePassword(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    generateId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map