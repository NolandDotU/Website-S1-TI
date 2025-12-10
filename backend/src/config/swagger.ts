import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJSDoc.Options = {
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
        url: `http://localhost:${env.PORT}/api/${env.NODE_ENV}`,
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

export const swaggerSpec = swaggerJSDoc(options);
