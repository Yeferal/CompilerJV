module.exports = {
    server: {
        PORT: process.env.PORT || '5200',
        DOMAIN: 'localhost',
    },
    // logger: 'combined',
    logger: 'dev',
    JWT_SECRET: 'secret'
}
