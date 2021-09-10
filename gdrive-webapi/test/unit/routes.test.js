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

        test("given an inexistent route it should choose default route", () => {
            const routes = new Routes();
            const params = { //clone defaultParams
                ...defaultParams
            }

            params.request.method = 'inexistent';
            routes.handler(...params.values());

            expect(params.response.end).toHaveBeenCalledWith('Hello World')
        });

        test.todo("it should set any request with CORS enabled");
        test.todo("given method OPTIONS it should choose options route");
        test.todo("given method GET it should choose get route");
        test.todo("given method POST it should choose post route");

    })
});