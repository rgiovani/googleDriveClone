import { describe, test, expect, jest } from '@jest/globals';
import Routes from './../../src/routes.js';

describe('#Routes test suite', () => {
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
        const defaultParams = {
            request: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                method: '',
                body: {}
            },
            response: { //mocks
                setHeader: jest.fn(),
                writeHead: jest.fn(),
                end: jest.fn()
            },
            values: () => Object.values(defaultParams)
        }

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
        test.skip('given method GET it should list all files downloaded', async () => {
            //- Para conseguir mockar, peguei as informações do meu arquivo na pasta downloads pelo terminal(downloads/) usando: 
            //>node - depois - >fs.statSync('github-cover.png')  - retorna as informações do sistema operacional desse arquivo.
            //-A ideia é, toda vez que alguem chamar, fs.stat, o teste não vai ter que olhar o sistema operacional e
            //não vai depender da existencia do arquivo, ele retornará apenas o fileStatusMock.
            const fileStatusMock = [{
                size: 85675,
                birthtime: "2021-09-11T05:53:55.349Z",
                owner: 'SystemUser',
                file: 'file.png'
            }];
        });


    })

});