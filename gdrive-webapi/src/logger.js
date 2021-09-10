import pino from 'pino';
const logger = pino({
    prettyPrint: {
        ignore: 'pid,hostname' //pid (process number)
    }
});

export { logger }