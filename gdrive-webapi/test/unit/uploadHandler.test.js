import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { logger } from '../../src/logger.js';

import UploadHandler from '../../src/uploadHandler.js';
import TestUil from '../_util/testUtil.js';

describe('#UploadHandler test suite', () => {
    const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => { }
    }

    beforeEach(() => { //mockando a função info do logger
        jest.spyOn(logger, 'info')
            .mockImplementation()
    });

    describe('#registerEvents', () => {
        test('it should call onFile and onFinish functions on Busboy instance', () => {
            const uploadHandler = new UploadHandler({
                io: ioObj,
                socketId: '01'
            });

            jest.spyOn(uploadHandler, uploadHandler.onFile.name)
                .mockResolvedValue(); //para saber se a função onFile() sera chamada.

            const headers = {
                'content-type': 'multipart/form-data; boundary='
            }
            const onFinish = jest.fn();

            const busboyInstance = uploadHandler.registerEvents(headers, onFinish);

            const fileStream = TestUil.generateReadableStream(['chunk', 'of', 'data']);
            busboyInstance.emit('file', 'fieldname', fileStream, 'filename')

            //console.log('eventos: ', busboyInstance.listeners("finish"))

            busboyInstance.listeners("finish")[0].call();

            expect(uploadHandler.onFile).toHaveBeenCalled();

            expect(onFinish).toHaveBeenCalled();
        });
    });

    describe('#onFile', () => {
        test('given a stream file it should save it on disk', async () => {
            const chunks = ['hey', 'dude'];
            const downloadsFolder = '/tmp'; //pasta ficticia
            const handler = new UploadHandler({
                io: ioObj,
                socketId: '01',
                downloadsFolder
            });

            const onData = jest.fn();

            //quando createwritestream for chamado, 
            //é chamado mockimplementation que "grava" o pedaço do data no disco.
            jest.spyOn(fs, fs.createWriteStream.name)
                .mockImplementation(() => TestUil.generateWritableStream(onData));

            const onTransform = jest.fn();
            jest.spyOn(handler, handler.handleFileBytes.name)
                .mockImplementation(() => TestUil.generateTransformStream(onTransform))

            const params = {
                fieldname: 'video',
                file: TestUil.generateReadableStream(chunks),
                filename: 'mockFile.mov'
            }

            await handler.onFile(...Object.values(params));

            expect(onData.mock.calls.join()).toEqual(chunks.join());
            expect(onTransform.mock.calls.join()).toEqual(chunks.join());

            // const expectedFileName = resolve(handler.downloadsFolder, params.filename);
            // expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFileName);
        });
    });

    describe('#handleFileBytes', () => {
        test('should call emit function and it should be a transform stream', async () => {
            jest.spyOn(ioObj, ioObj.to.name);
            jest.spyOn(ioObj, ioObj.emit.name);

            const handler = new UploadHandler({
                io: ioObj,
                sockedId: '01'
            });

            jest.spyOn(handler, handler.canExecute.name)
                .mockReturnValue(true);

            const messages = ['hello', 'world'];
            const source = TestUil.generateReadableStream(messages);
            const onWrite = jest.fn();
            const target = TestUil.generateWritableStream(onWrite);

            await pipeline(
                source,
                handler.handleFileBytes("filename.txt"),
                target
            );

            expect(ioObj.to).toHaveBeenCalledTimes(messages.length);
            expect(ioObj.emit).toHaveBeenCalledTimes(messages.length);

            // se o handleFileBytes for um transform stream, nosso pipeline
            // vai continuar o processo passando os dados para frente 
            // e chamar nossa função no target a cada chunk.
            expect(onWrite).toBeCalledTimes(messages.length);
            expect(onWrite.mock.calls.join()).toEqual(messages.join());
        })
    });


});