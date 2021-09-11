import { describe, test, expect, jest } from '@jest/globals';
import fs, { stat } from 'fs'
import FileHelper from '../../src/fileHelper.js';

import Routes from './../../src/routes.js';

describe('#FileHelper', () => {
    describe('#getFileStatus', () => {
        test('it should return files statuses in correct format', async () => {
            const statMock = {
                dev: 774356522,
                mode: 33206,
                nlink: 1,
                uid: 0,
                gid: 0,
                rdev: 0,
                blksize: 4096,
                ino: 3096224744130803,
                size: 85675,
                blocks: 168,
                atimeMs: 1631339668827.7112,
                mtimeMs: 1631339635701.271,
                ctimeMs: 1631339649115.4941,
                birthtimeMs: 1631339635348.7092,
                atime: "2021-09-11T05:54:28.828Z",
                mtime: "2021-09-11T05:53:55.701Z",
                ctime: "2021-09-11T05:54:09.115Z",
                birthtime: "2021-09-11T05:53:55.349Z"
            }

            const mockUser = 'rgiovani';
            process.env.USER = mockUser;
            const filename = 'file.png';

            //terminal: node
            //fs.readdirSync('.'); ['github-cover.png'] // retorna um array com nome dos arquivos.
            jest.spyOn(fs.promises, fs.promises.readdir.name)
                .mockResolvedValue([filename]);//mockando 'file.png' dentro de readdir.

            //tira a responsabilidade do sistema operacional
            jest.spyOn(fs.promises, fs.promises.stat.name)
                .mockResolvedValue(statMock);

            const result = await FileHelper.getFileStatus("/tmp")

            const expectedResult = [
                {
                    size: "85.7 kB",
                    lastModified: statMock.birthtime,
                    owner: mockUser,
                    file: filename
                }
            ];

            expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`);
            expect(result).toMatchObject(expectedResult);
        });
    })
});