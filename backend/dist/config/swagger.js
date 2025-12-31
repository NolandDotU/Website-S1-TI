"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation Website S1 Teknik Informatika UKSW",
            version: "1.0.0",
            contact: {
                name: "Joseph Sebastian Rosario Putra",
                email: "672023095@student.uksw.edu",
            },
        },
        servers: [
            {
                url: `http://localhost:${env_1.env.PORT}/api/${env_1.env.NODE_ENV}`,
                description: "Development Server",
            },
            {
                description: "Production Server (comming soon)",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {},
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    apis: ["./src/api/v1/**/*.ts"],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map