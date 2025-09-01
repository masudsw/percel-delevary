import dotenv from "dotenv"
dotenv.config()

interface IEnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    FRONTEND_URL:string,
    BACKEND_URL:string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
    JWT_ACCESS_SECRET: string,
    JWT_ACCESS_EXPIRES: string,
    BCRYPT_SALT_ROUND: string,
    EXPRESS_SESSION_SECRET: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CALLBACK_URL: string,
    REDIS_USERNAME: string,
    REDIS_PASSWORD: string,
    REDIS_HOST: string,
    REDIS_PORT: string
    EMAIL_SENDER: {
        SMTP_PASS: string,
        SMTP_HOST: string,
        SMTP_PORT: string,
        SMTP_USER: string,
        SMTP_FROM: string
    }

}

const loadEnvVariables = (): IEnvConfig => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NOVE_ENV",
        "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD","FRONTEND_URL",
        "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES",
        "BCRYPT_SALT_ROUND", "EXPRESS_SESSION_SECRET",
        "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "REDIS_USERNAME", "REDIS_PASSWORD", "REDIS_HOST", "REDIS_PORT",
        " SMTP_PASS", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_FROM","BACKEND_URL"
    ]
    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            new Error(`Missing required environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        FRONTEND_URL:process.env.FRONTEND_URL as string,
        BACKEND_URL:process.env.BACKEND_URL as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        REDIS_USERNAME: process.env.REDIS_USERNAME as string,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
        REDIS_HOST: process.env.REDIS_HOST as string,
        REDIS_PORT: process.env.REDIS_PORT as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_FROM: process.env.SMTP_FROM as string,
            SMTP_PASS:process.env.SMTP_PASS as string
        }

    }
}
export const envVars = loadEnvVariables()