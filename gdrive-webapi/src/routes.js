import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import FileHelper from "./fileHelper.js";
import { logger } from "./logger.js";
import UploadHandler from './uploadHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url)); //pega o nome da pasta desse arquivo.
const defaultDownloadsFolder = resolve(__dirname, '../', 'downloads');

export default class Routes {
    io
    constructor(downloadsFolder = defaultDownloadsFolder) {
        this.downloadsFolder = downloadsFolder;
        this.fileHelper = FileHelper;
        this.io = {};
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
        const { headers } = request

        const { query: { socketId } } = parse(request.url, true)
        const uploadHandler = new UploadHandler({
            socketId,
            io: this.io,
            downloadsFolder: this.downloadsFolder
        })

        const onFinish = (response) => () => {
            response.writeHead(200)
            const data = JSON.stringify({ result: 'Files uploaded with success! ' })
            response.end(data)
        }

        const busboyInstance = uploadHandler.registerEvents(
            headers,
            onFinish(response)
        )

        await pipeline(
            request,
            busboyInstance
        )

        logger.info('Request finished with success!');
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