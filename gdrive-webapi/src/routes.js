import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import FileHelper from "./fileHelper.js";
import { logger } from "./logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url)); //pega o nome da pasta desse arquivo.
const defaultDownloadsFolder = resolve(__dirname, '../', 'downloads');

export default class Routes {
    io
    constructor(downloadsFolder = defaultDownloadsFolder) {
        this.downloadsFolder = downloadsFolder;
        this.fileHelper = FileHelper;
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
        const files = await this.fileHelper.getFileStatus(this.downloadsFolder);

        response.writeHead(200);
        response.end(JSON.stringify(files));
    }

    handler(request, response) {
        response.setHeader('Access-Control-Allow-Origin', '*'); //libera o cors e todos os acessos
        const chosen = this[request.method.toLowerCase()] || this.defaultRoute;

        //apply é a mesma coisa que dizer chosen(), porém, o apply permite dizer quem é o this,
        //e permite identificar o array de argumentos.
        return chosen.apply(this, [request, response]);
    }
}