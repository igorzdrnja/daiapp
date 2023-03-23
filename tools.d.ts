/**
 * Get an average number of requests per specific timeframe i.e. per minute
 * @param {number} timeframe - timeframe to get statistics for, in milliseconds (i.e. one minute is 60 * 1000 * 1000)
 * @returns {Promise<number>} - an average number of requests
 */
declare const getAverageNoOfRequests: (timeframe: number) => Promise<number>;
/**
 * Get a number of requests in the specific timeframe
 * @param {number} from - timeframe start in milliseconds
 * @param {number} to - timeframe end in milliseconds
 * @returns {Promise<number>} - no of requests
 */
declare const getNoOfRequests: (from: number, to: number) => Promise<number>;
/**
 * Return an API key with the maximum number of requests overall
 * @returns { Promise<Record<string, string>> } - object containing an API key and count of requests
 */
declare const getMostUsedApiKey: () => Promise<any>;
export { getAverageNoOfRequests, getNoOfRequests, getMostUsedApiKey };
