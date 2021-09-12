import Busboy from 'busboy'

export default class UploadHandler {
    constructor({ io, sockedId }) {

    }

    onFile(fieldname, file, filename) {

    }

    registerEvents(headers, onFinish) {
        const busboy = new Busboy({ headers })

        //listeners
        busboy.on('file', this.onFile.bind(this));
        busboy.on('finish', onFinish);

        return busboy;
    }
}