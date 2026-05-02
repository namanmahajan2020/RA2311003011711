const axios = require("axios");
const { Log } = require("../logging_middleware/logger");

const VEHICLES_API_URL = "http://20.207.122.201/evaluation-service/vehicles";

async function getVehicleData(accessToken) {
  try {
    const response = await axios.get(VEHICLES_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const vehicles = response.data?.vehicles || [];

    if (accessToken) {
      await Log(
        "backend",
        "info",
        "service",
        "Fetched vehicles",
        accessToken
      );
    }

    return vehicles;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getVehicleData,
};
