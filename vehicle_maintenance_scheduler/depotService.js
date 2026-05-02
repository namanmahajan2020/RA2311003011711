const axios = require("axios");
const { Log } = require("../logging_middleware/logger");

const DEPOTS_API_URL = "http://20.207.122.201/evaluation-service/depots";

async function getDepotData(accessToken) {
  try {
    const response = await axios.get(DEPOTS_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const depots = response.data?.depots || [];

    if (accessToken) {
      await Log(
        "backend",
        "info",
        "service",
        "Fetched depots",
        accessToken
      );
    }

    return depots;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getDepotData,
};
