const axios = require('axios');

async function getClan(tag) {
    const response = await axios.get(
        `https://api.clashofclans.com/v1/clans/%23${tag}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.COC_TOKEN}`
            }
        }
    );

    return response.data;
}

module.exports = { getClan };
