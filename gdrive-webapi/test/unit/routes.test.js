import { describe, test, expect, jest } from '@jest/globals';

import Routes from './../../src/routes.js';
import TestUtil from '../_util/testUtil.js';
import UploadHandler from '../../src/uploadHandler.js';

import { logger } from '../../src/logger.js';

describe('#Routes test suite', () => {
    beforeEach(() => {
        jest.spyOn(logger, 'info')
            .mockImplementation()
    })

    const request = TestUtil.generateReadableStream(['some file bytes'])
    const response = TestUtil.generateWritableStream(() => { })

    const defaultParams = {
        request: Object.assign(request, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: '',
            body: {}
        }),
        response: Object.assign(response, { //mocks
            setHeader: jest.fn(),
            writeHead: jest.fn(),
            end: jest.fn()
        }),
        values: () => Object.values(defaultParams)
    }

    describe('#setSocketInstance', () => {
        test('setSocket should store io instance', () => {
            const routes = new Routes();
            const ioObj = {
                to: (id) => ioObj,
                emit: (event, message) => { }
            }

            routes.setSocketInstance(ioObj)
            expect(routes.io).toStrictEqual(ioObj)
        })
    });

    describe('#handler', () => {
        test("given an inexistent route it should choose default route", async () => {
            const routes = new Routes();
            const params = { //clone defaultParams
                ...defaultParams
            }

            params.request.method = 'inexistent';
            await routes.handler(...params.values());

            expect(params.response.end).toHaveBeenCalledWith('Hello World')
        });

        test("it should set any request with CORS enabled", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            params.request.method = 'inexistent';
            await routes.handler(...params.values());

            expect(params.response.setHeader)
                .toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
        });

        test("given method OPTIONS it should choose options route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            params.request.method = 'OPTIONS';
            await routes.handler(...params.values());

            expect(params.response.writeHead).toHaveBeenCalledWith(204)
            expect(params.response.end).toHaveBeenCalled()
        });

        test("given method GET it should choose get route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            params.request.method = 'GET';

            //- O jest apenas verifica se a função post foi chamada, 
            //ignorando a lógica que há dentro da função.
            //- Retorna uma promise com qualquer valor.
            jest.spyOn(routes, routes.get.name).mockResolvedValue()

            await routes.handler(...params.values());
            expect(routes.get).toHaveBeenCalled()
        });

        test("given method POST it should choose post route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            params.request.method = 'POST';

            jest.spyOn(routes, routes.post.name).mockResolvedValue()

            await routes.handler(...params.values());
            expect(routes.post).toHaveBeenCalled()
        });

    });

    describe('#get', () => {
        test('given method GET it should list all files downloaded', async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            //- Para conseguir mockar, peguei as informações do meu arquivo na pasta downloads pelo terminal(downloads/) usando: 
            //>node - depois - >fs.statSync('github-cover.png')  - retorna as informações do sistema operacional desse arquivo.
            //-A ideia é, toda vez que alguem chamar, fs.stat, o teste não vai ter que olhar o sistema operacional e
            //não vai depender da existencia do arquivo, ele retornará apenas o fileStatusesMock.
            const fileStatusesMock = [
                {
                    size: "85.7 kB",
                    lastModified: "2021-09-11T05:53:55.349Z",
                    owner: 'rgiovani',
                    file: 'file.txt'
                }
            ];

            jest.spyOn(routes.fileHelper, routes.fileHelper.getFileStatus.name)
                .mockResolvedValue(fileStatusesMock);

            params.request.method = 'GET';
            await routes.handler(...params.values());

            expect(params.response.writeHead).toHaveBeenCalledWith(200);
            expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(fileStatusesMock));

        });


    });

    describe('#post', () => {
        test('it should validate post route workflow', async () => {
            const routes = new Routes('/tmp')
            const options = {
                ...defaultParams
            }
            options.request.method = 'POST'
            options.request.url = '?socketId=10'


            jest.spyOn(
                UploadHandler.prototype,
                UploadHandler.prototype.registerEvents.name
            ).mockImplementation((headers, onFinish) => {
                const writable = TestUtil.generateWritableStream(() => { })
                writable.on("finish", onFinish)

                return writable
            });

            await routes.handler(...options.values());

            expect(UploadHandler.prototype.registerEvents).toHaveBeenCalled();
            expect(options.response.writeHead).toHaveBeenCalledWith(200);

            const expectedResult = JSON.stringify({ result: 'Files uploaded with success! ' });
            expect(options.response.end).toHaveBeenCalledWith(expectedResult);

        })
    });

});