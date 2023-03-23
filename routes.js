import { db, daiContract } from './app.js'
import express from 'express'
import {ethers} from "ethers";
import {register} from "prom-client";
const router = express.Router()

// Get the last 100 DAI transactions
router.get('/transactions', async (req, res) => {
    try {
        // Pagination params
        let { limit, offset } = req.query;
        limit = limit || 100;
        offset = offset || 0;
        const transactions = await db('transactions')
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

        res.send(transactions);
    } catch (e) {
        return res.status(400).json({
            message: 'Error retrieving transactions: ' + e.message
        })
    }
});

// Get DAI transactions by sender or recipient
router.get('/transactions/:address', async (req, res) => {
    try {
        const { address } = req.params;
        if (!ethers.isAddress(address)) {
            return res.status(404).json({
                message: 'Invalid request'
            })
        }
        const transactions = await db('transactions')
            .where('recipient', address)
            .orWhere('sender', address)
            .orderBy('created_at', 'desc');

        res.send(transactions);
    } catch (e) {
        return res.status(400).json({
            message: 'Error retrieving transactions for the address: ' + e.message
        })
    }
});

// Get relative DAI balance of an address calculated from local indexed / aggregated data only
router.get('/balance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        if (!ethers.isAddress(address)) {
            return res.status(404).json({
                message: 'Invalid request'
            })
        }
        const toTrxSum = await db('transactions')
            .where('recipient', address)
            .sum('amount')
        const fromTrxSum = await db('transactions')
            .where('sender', address)
            .sum('amount')
        res.send({ balance: toTrxSum[0].sum - fromTrxSum[0].sum });
    } catch (e) {
        return res.status(400).json({
            message: 'Error retrieving indexed / aggregated balance of the address: ' + e.message
        })
    }
});

// Get overall DAI balance of an address in USD based on the onchain data
router.get('/balance/onchain/:address', async (req, res) => {
    try {
        const { address } = req.params;
        if (!ethers.isAddress(address)) {
            return res.status(404).json({
                message: 'Invalid request'
            })
        }
        const balance = await daiContract.balanceOf(address);
        res.send({ balance: parseFloat(ethers.formatEther(balance)) });
    } catch (e) {
        return res.status(400).json({
            message: 'Error retrieving balance of the address: ' + e.message
        })
    }
});

// Health check
router.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Prometheus metrics
router.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    const data = await register.metrics();
    res.send(data);
});

export {
    router
}