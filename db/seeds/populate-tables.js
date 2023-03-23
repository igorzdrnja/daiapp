/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex('transactions').del()
    await knex('transactions').insert([
        {
            sender: '0x74de5d4FCbf63E00296fd95d33236B9794016631',
            recipient: '0xB3C839dbde6B96D37C56ee4f9DAd3390D49310Aa',
            amount: 100,
            created_at: Date.now()
        },
        {
            sender: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
            recipient: '0x74de5d4FCbf63E00296fd95d33236B9794016631',
            amount: 200,
            created_at: Date.now()
        },
        {
            sender: '0x1234567890123456789012345678901234567890',
            recipient: '0x280027dd00eE0050d3F9d168EFD6B40090009246',
            amount: 0,
            created_at: Date.now()
        },
        {
            sender: '0x74de5d4FCbf63E00296fd95d33236B9794016631',
            recipient: '0xB3C839dbde6B96D37C56ee4f9DAd3390D49310Aa',
            amount: 12345,
            created_at: Date.now()
        },
        {
            sender: '0x0000000000000000000000000000000000000000',
            recipient: '0x74de5d4FCbf63E00296fd95d33236B9794016631',
            amount: 200,
            created_at: Date.now()
        },
        {
            sender: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            recipient: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
            amount: 25674.088,
            created_at: Date.now()
        },
        {
            sender: '0x74de5d4FCbf63E00296fd95d33236B9794016631',
            recipient: '0xB3C839dbde6B96D37C56ee4f9DAd3390D49310Aa',
            amount: 126.324585,
            created_at: Date.now()
        },
        {
            sender: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
            recipient: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
            amount: 200,
            created_at: Date.now()
        },
        {
            sender: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
            recipient: '0x280027dd00eE0050d3F9d168EFD6B40090009246',
            amount: 32,
            created_at: Date.now()
        },
        {
            sender: '0x74de5d4FCbf63E00296fd95d33236B9794016631',
            recipient: '0xB3C839dbde6B96D37C56ee4f9DAd3390D49310Aa',
            amount: 100,
            created_at: Date.now()
        },
        {
            sender: '0xDD6F19Ac68Ba992d24F945038938534877D6B80d',
            recipient: '0x74de5d4FCbf63E00296fd95d33236B9794016631',
            amount: 300,
            created_at: Date.now()
        },
        {
            sender: '0x1234567890123456789012345678901234567890',
            recipient: '0xDD6F19Ac68Ba992d24F945038938534877D6B80d',
            amount: 50000,
            created_at: Date.now()
        },
    ]);

    await knex('api_logs').del()
    await knex('api_logs').insert([
        {
            method: 'GET',
            url: '/transactions/0x1234567890123456789012345678901234567890',
            api_key: 'test_key_1',
            body: {},
            created_at: 1679395682403
        },
        {
            method: 'GET',
            url: '/transactions',
            api_key: 'test_key_1',
            body: {},
            created_at: 1679395682655},
        {
            method: 'GET',
            url: '/transactions?limit=3',
            api_key: 'test_key_1',
            body: {},
            created_at: 1679395714324},
        {
            method: 'GET',
            url: '/balance/0x1234567890123456789012345678901234567890',
            api_key: 'test_key_1',
            body: {},
            created_at: 1679395762681
        },
        {
            method: 'GET',
            url: '/balance/absolute/0x1234567890123456789012345678901234567890',
            api_key: 'test_key_1',
            body: {},
            created_at: 1679395779694
        },
        {method: 'GET', url: '/balance/foo', api_key: 'test_key_2', body: {}, created_at: Date.now()},
        {
            method: 'GET',
            url: '/balance/0x0000000000000000000000000000000000000000',
            api_key: 'test_key_2',
            body: {},
            created_at: 1679395787672
        },
        {method: 'GET', url: '/transactions', api_key: 'test_key_2', body: {}, created_at: Date.now()},
        {
            method: 'GET',
            url: '/transactions/0xDD6F19Ac68Ba992d24F945038938534877D6B80d',
            api_key: 'test_key_2',
            body: {},
            created_at: 1679401037965
        },
        {method: 'GET', url: '/transactions?limit=10', api_key: 'test_key_2', body: {}, created_at: Date.now()},
        {
            method: 'GET',
            url: '/balance/0x74de5d4FCbf63E00296fd95d33236B9794016631',
            api_key: 'test_key_2',
            body: {},
            created_at: 1679469212530
        },
        {
            method: 'GET',
            url: '/balance/0xB3C839dbde6B96D37C56ee4f9DAd3390D49310Aa',
            api_key: 'test_key_3',
            body: {},
            created_at: 1679469213530
        },
        {
            method: 'GET',
            url: '/balance/0xB3C839dbde6B96D37C56ee4f9DAd3390D49310Aa',
            api_key: 'test_key_3',
            body: {},
            created_at: 1679469213560
        },
        {method: 'GET', url: '/transactions', api_key: 'test_key_3', body: {}, created_at: Date.now()},
        {
            method: 'GET',
            url: '/balance/0x280027dd00eE0050d3F9d168EFD6B40090009246',
            api_key: 'test_key_4',
            body: {},
            created_at: 1679469213600
        },
        {
            method: 'GET',
            url: '/balance/0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            api_key: 'test_key_5',
            body: {},
            created_at: 1679469213800
        },
        {
            method: 'GET',
            url: '/balance/0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
            api_key: 'test_key_5',
            body: {},
            created_at: 1679469225000
        },
        {
            method: 'GET',
            url: '/transactions?limit=2',
            api_key: 'test_key_6',
            body: {},
            created_at: 1679469234000
        },
    ]);
};
