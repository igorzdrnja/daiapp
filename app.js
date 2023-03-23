import path from 'path';
import { config } from 'dotenv'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_PATH = __dirname;

//Environment vars logic
let envFilename;
if (process.env.NODE_ENV) {
    envFilename = '.env.' + process.env.NODE_ENV
} else {
    envFilename = '.env'
}

config({ path: path.join(BASE_PATH, '/' + envFilename) })

import fs from "fs";
import express from 'express';
import bodyParser from 'body-parser';
import db from './db/knex.js';
import morgan from 'morgan';
import { ethers } from "ethers";
import { router as indexRouter } from './routes.js';
import cors from 'cors';
import helmet from 'helmet';
import { collectDefaultMetrics } from 'prom-client';

// Create Express.js app
const app = express();

app.use(cors());
app.use(helmet());

collectDefaultMetrics();

// Enable parsing of JSON request body
app.use(bodyParser.json());

// Logging with morgan
app.use(morgan('combined', { stream: fs.createWriteStream('access.log', { flags: 'a' }) }));

// Define API key middleware
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    // Todo: proper authenticating logic
    if (!apiKey || apiKey === 'ULTRA-SECRET-KEY') {
        res.status(401).send('Unauthorized');
    } else {
        next();
    }
};

// Enable API key middleware for all routes
app.use(apiKeyMiddleware);

// Define API rate limiting middleware
const rateLimitingMiddleware = async (req, res, next) => {
    const { method, url } = req;
    const apiKey = req.headers['x-api-key'];

    const requestCount = await db('api_logs')
        .where('method', method)
        .where('url', url)
        .where('created_at', '>', Math.floor(Date.now()) - 60 * 60 * 1000 * 1000)
        .where('api_key', apiKey)
        .count();
    // Max requests per api key per hour limiting
    if (+requestCount[0].count > +process.env.MAX_REQUESTS_PER_HOUR_PER_API_KEY) {
        return res.status(429).json({message: 'Too many requests'});
    } else {
        next();
    }
};

app.use(rateLimitingMiddleware);

// Define API request logging middleware
const loggingMiddleware = async (req, res, next) => {
    try {
        const {method, url, headers, body} = req;

        await db('api_logs').insert({
            method,
            url,
            api_key: headers['x-api-key'],
            body: JSON.stringify(body),
            created_at: Math.floor(Date.now())
        });

        next();
    } catch (e) {
        console.log('Error inserting the query in db', e)
        return res.status(429).json({message: 'Error inserting the query in db'});
    }
};

// Enable API request logging middleware for all routes
app.use(loggingMiddleware);

// Ethereum node created by Quicknode
const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);

// Create DAI contract object
const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const daiAbi = [
    // get the account balance
    "function balanceOf(address) view returns (uint)",

    // an event is triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)"
];
const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

// Listen for new DAI transactions and store in MySQL
daiContract.on('Transfer', async (from, to, amount) => {
    const txMoment = Math.floor(Date.now())
    console.log('New transfer from ', from , ' to ', to, ' amount: ', amount);
    try {
        await db('transactions').insert({
            sender: from,
            recipient: to,
            // Amount in USD
            amount: parseFloat(ethers.formatEther(amount)),
            created_at: txMoment
        });
    } catch (e) {
        console.log('Error inserting transaction data into db at ', Math.floor(Date.now()))
    }
});

app.use('/', indexRouter);

export {
    app,
    db,
    daiContract,
    loggingMiddleware,
    rateLimitingMiddleware
};