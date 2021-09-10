import { logger } from "./logger.js";

export default class Routes {
    io
    constructor() {
    }

    setSocketInstance(io) {
        this.io = io;
    }

    async defaultRoute(request, response) {
        response.end("Hello World");
    }

    //é enviado geralmente pelo browser, assim o browser sabe se a api está de pé e
    //se esta disposta para receber alguma coisa.
    async options(request, response) {
        response.writeHead(204);
        response.end();
    }

    async post(request, response) {
        logger.info('post')
        response.end();
    }


    async get(request, response) {
        logger.info('get')
        response.end();
    }

    handler(request, response) {
        response.setHeader('Access-Control-Allow-Origin', '*'); //libera o cors e todos os acessos
        const chosen = this[request.method.toLowerCase()] || this.defaultRoute;

        //apply é a mesma coisa que dizer chosen(), porém, o apply permite dizer quem é o this,
        //e permite identificar o array de argumentos.
        return chosen.apply(this, [request, response]);
    }
}