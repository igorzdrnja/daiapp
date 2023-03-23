import {db} from './app.js';

/**
 * Get an average number of requests per specific timeframe i.e. per minute
 * @param {number} timeframe - timeframe to get statistics for, in milliseconds (i.e. one minute is 60 * 1000 * 1000)
 * @returns {Promise<number>} - an average number of requests
 */
const getAverageNoOfRequests = async (timeframe: number) => {
    const txTotalCount = await db.count('id').from('api_logs').first();
    const firstTx = await db('api_logs').column('created_at').orderBy('created_at').first();
    if (txTotalCount) {
        // Get average no. of requests per millisecond
        let avg = (txTotalCount.count as number / (Date.now() - firstTx.created_at));
        // Get average no. of requests per desired timeframe
        avg *= timeframe
        console.log('Average queries per ', timeframe, ' milliseconds: ', avg)
        return avg;
    }
};

/**
 * Get a number of requests in the specific timeframe
 * @param {number} from - timeframe start in milliseconds
 * @param {number} to - timeframe end in milliseconds
 * @returns {Promise<number>} - no of requests
 */
const getNoOfRequests = async (from: number, to: number) => {
    const txTotalCount = await db.count('id')
        .from('api_logs')
        .whereBetween('created_at', [from, to]);
    return parseInt(txTotalCount[0].count as string);
};

/**
 * Return an API key with the maximum number of requests overall
 * @returns { Promise<Record<string, string>> } - object containing an API key and count of requests
 */
const getMostUsedApiKey = async () => {
    return db('api_logs')
        .column('api_key')
        .count('id as req_count')
        .groupBy('api_key')
        .orderBy('req_count', 'desc')
        .first();
};

console.log(await getMostUsedApiKey())

export {
    getAverageNoOfRequests,
    getNoOfRequests,
    getMostUsedApiKey
}