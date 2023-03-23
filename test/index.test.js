import request from 'supertest'
import { app, loggingMiddleware, rateLimitingMiddleware } from '../app.js'
import { ethers } from 'ethers'
import { jest } from '@jest/globals'

jest.setTimeout(10000);

const commonHeaders = {
    'x-api-key': 'foo'
};

describe('DAI API', () => {
    let server;

    beforeEach(async () => {
        server = app.listen();
    });

    afterEach(async () => {
        await server.close();
    });

    describe('GET /transactions', () => {
        it('should return the last 100 (or less if less present in db) transactions', async () => {
            const res = await request(server).get('/transactions').set(commonHeaders)
            expect(res.status).toEqual(200);
            expect(res.body.length).toEqual(12);
        });

        it('should return transactions with limit', async () => {
            const res = await request(server).get('/transactions?limit=5').set(commonHeaders);
            expect(res.status).toEqual(200);
            expect(res.body.length).toEqual(5);
        });

        it('should return 401 when there is no api key', async () => {
            const res = await request(app).get('/transactions');
            expect(res.statusCode).toEqual(401);
            expect(res.text).toContain('Unauthorized');
        });
    });

    describe('GET /transactions/:address', () => {
        it('should return transactions by address', async () => {
            const address = '0x1234567890123456789012345678901234567890';
            const res = await request(server).get(`/transactions/${address}`).set(commonHeaders);
            expect(res.status).toEqual(200);
            expect(res.body.length).toEqual(2);
            for (const tx of res.body) {
                expect(tx.sender.toLowerCase()).toEqual(address.toLowerCase());
            }
        });

        it('should fail because of an invalid address input', async () => {
            const address = 'foo';
            const res = await request(server).get(`/transactions/${address}`).set(commonHeaders);
            expect(res.status).toEqual(404);
        });

        it('should return 401 when there is no api key', async () => {
            const address = '0x1234567890123456789012345678901234567890';
            const res = await request(server).get(`/transactions/${address}`);
            expect(res.statusCode).toEqual(401);
            expect(res.text).toContain('Unauthorized');
        });
    });

    describe('GET /balance/:address', () => {
        it('should return address balance in USD from local indexed / aggregated transactions', async () => {
            const address = '0x1234567890123456789012345678901234567890';
            const res = await request(server).get(`/balance/${address}`).set(commonHeaders);
            expect(res.status).toEqual(200);
            expect(Number(res.body.balance)).toEqual(-50000);
        });

        it('should return 401 when there is no api key', async () => {
            const address = '0x1234567890123456789012345678901234567890';
            const res = await request(server).get(`/balance/${address}`);
            expect(res.statusCode).toEqual(401);
            expect(res.text).toContain('Unauthorized');
        });
    });

    describe('GET /balance/absolute/:address', () => {
        it('should return address balance in USD from onchain data', async () => {
            const address = '0x1234567890123456789012345678901234567890';
            const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
            const balance = await provider.getBalance(address);
            expect(Number(balance)).toBeDefined()
        });

        it('should return 401 when there is no api key', async () => {
            const address = '0x1234567890123456789012345678901234567890';
            const res = await request(server).get(`/balance/absolute/${address}`);
            expect(res.statusCode).toEqual(401);
            expect(res.text).toContain('Unauthorized');
        });
    });

    describe('rateLimitingMiddleware', () => {
        const mockHandler = jest.fn();
        const mockRequest = { method: 'GET', url: '/balance/0x1234567890123456789012345678901234567890', body: {} };
        const mockResponse = () => {
            const res = {};
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
        const mockNext = jest.fn();

        beforeEach(() => {
            mockHandler.mockClear();
            mockNext.mockClear();
        });

        it('should call next when rate limit is not exceeded, and reject requests when it is exceeded', async () => {
            const mockMaxRequests = process.env.MAX_REQUESTS_PER_HOUR_PER_API_KEY;
            mockRequest.headers = {
                'x-api-key': 'foobarzzz'
            };

            const mockRes = mockResponse()
            for (let i = 0; i < parseInt(mockMaxRequests) + 1; i++) {
                await loggingMiddleware(mockRequest, mockRes, mockNext)
                expect(mockNext).toHaveBeenCalledTimes(i + 1);
            }
            await rateLimitingMiddleware(mockRequest, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(429);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Too many requests' });
        })
    })
});