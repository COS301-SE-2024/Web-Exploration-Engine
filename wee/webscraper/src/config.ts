export default () => ({
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
});