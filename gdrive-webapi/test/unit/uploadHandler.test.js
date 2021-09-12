import { describe, test, expect, jest } from '@jest/globals';
import fs from 'fs';
import { resolve } from 'path';

import UploadHandler from '../../src/uploadHandler.js';
import TestUil from '../_util/testUtil.js';

describe('#UploadHandler test suite', () => {
    const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => { }
    }
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
    })
});