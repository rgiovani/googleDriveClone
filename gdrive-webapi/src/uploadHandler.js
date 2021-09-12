import { pipeline } from 'stream/promises'; //apinova
import fs from 'fs';
import Busboy from 'busboy';
import { logger } from './logger.js'
import path from 'path';

export default class UploadHandler {
    constructor({ io, sockedId, downloadsFolder }) {
        this.io = io;
        this.sockedId = sockedId;
        this.downloadsFolder = downloadsFolder;
    }

    //* Extrair o que é preciso saber de informação para que assim
    //o byte possa ser salvo em disco.
    handleFileBytes() {

    }

    async onFile(fieldname, file, filename) {
        const savePath = `${this.downloadsFolder}/${filename}`;

        //Para cada arquivo vamos manipula-lo individualmente.
        await pipeline(
            //1o passo, pegar uma readable stream!
            file,
            //2o passo, filtrar, converter, transformar dados!
            this.handleFileBytes.apply(this, [filename]),
            //3o passo, é saida do processo, uma writable stream!
            fs.createWriteStream(savePath)
        );

        logger.info(`File [${filename}] finished`);
    }

    registerEvents(headers, onFinish) {
        const busboy = new Busboy({ headers })

        //listeners
        busboy.on('file', this.onFile.bind(this));
        busboy.on('finish', onFinish);

        return busboy;
    }
}