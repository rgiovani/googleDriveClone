import { Readable, Writable, Transform } from 'stream'

export default class TestUil {

    //* Recebe um array de informações e envia esse array para os clientes.
    static generateReadableStream(data) {
        return new Readable({ //Vai enviar eventos e quem tiver escutando irá receber esses eventos.
            objectMode: true,
            async read() {
                for (const item of data) {
                    //envia as informações do array(data) para quem estiver escutando.
                    this.push(item)
                }

                //uma forma de dizer que o readable stream parou de mandar dados (a fonte esgotou).
                this.push(null);
            }
        })
    }

    //* Processo final para salvar o arquivo no disco.
    static generateWritableStream(onData) {
        return new Writable({
            objectMode: true,
            write(chunk, enconding, callback) {
                onData(chunk);
                callback(null, chunk);
            }
        })
    }

    static generateTransformStream(onData) { //TransformStream: tambem é conhecido como Duplex stream(duas vias de entrada e saida)
        return new Transform({
            objectMode: true,
            transform(chunk, enconding, callback) {
                onData(chunk);
                callback(null, chunk);
            }
        })
    }
}