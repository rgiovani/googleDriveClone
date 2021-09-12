import { describe, test, expect, jest } from '@jest/globals';

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

    // describe('', () => {
    //     test.todo();
    // })
});