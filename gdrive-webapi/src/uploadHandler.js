import { pipeline } from 'stream/promises'; //apinova
import fs from 'fs';
import Busboy from 'busboy';

import { logger } from './logger.js'

export default class UploadHandler {
    constructor({ io, socketId, downloadsFolder, messageTimeDelayMs = 200 }) {
        this.io = io;
        this.socketId = socketId;
        this.downloadsFolder = downloadsFolder;
        this.messageTimeDelayMs = messageTimeDelayMs;
        this.ON_UPLOAD_EVENT = 'file-upload';
    }

    //[Padrão Backpressure] - Manipulador de pressão.
    //Permite que a menssagem só seja enviada para o cliente quando ela tiver permissão.
    canExecute(lastExecution) {
        return (Date.now() - lastExecution) >= this.messageTimeDelayMs;
    }

    //* Extrair o que é preciso saber de informação para que assim
    //o byte possa ser salvo em disco.
    handleFileBytes(filename) {
        this.lastMessageSent = Date.now();

        async function* handleData(source) {
            let processedAlready = 0;

            for await (const chunk of source) {
                yield chunk; //yeld manda continuar o processo enquanto as proximas linhas trabalha em paralelo

                processedAlready += chunk.length;
                if (!this.canExecute(this.lastMessageSent)) {
                    continue;
                }

                this.lastMessageSent = Date.now();

                //notifica os clientes que o esse socket id evoluiu
                this.io.to(this.sockedId).emit(this.ON_UPLOAD_EVENT, { processedAlready, filename });
                logger.info(`File [${filename}] got ${processedAlready} bytes to ${this.sockedId}`);
            }
        }

        return handleData.bind(this);
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