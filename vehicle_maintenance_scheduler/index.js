const axios = require("axios");
const { Log } = require("../logging_middleware/logger");
const { getDepotData } = require("./depotService");
const { getVehicleData } = require("./vehicleService");
const solveMaintenanceKnapsack = require("./knapsack");

const AUTH_API_URL = "http://20.207.122.201/evaluation-service/auth";
const CLIENT_ID = process.env.AFFORDMED_CLIENT_ID;
const CLIENT_SECRET = process.env.AFFORDMED_CLIENT_SECRET;
const authPayload = {
  email: process.env.AFFORDMED_EMAIL || "random12345@srmist.edu.in",
  name: process.env.AFFORDMED_NAME || "temp user",
  rollNo: process.env.AFFORDMED_ROLLNO || "temp12345",
  accessCode: process.env.AFFORDMED_ACCESS_CODE || "QkbpxH",
};

async function authenticateUser(clientID, clientSecret) {
  const response = await axios.post(
    AUTH_API_URL,
    {
      email: authPayload.email,
      name: authPayload.name,
      rollNo: authPayload.rollNo,
      accessCode: authPayload.accessCode,
      clientID,
      clientSecret,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  const token = response.data.access_token;

  if (!token) {
    throw new Error("No access token received");
  }

  return token;
}

function getClientCredentials() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "Client credentials not found. Please set AFFORDMED_CLIENT_ID and AFFORDMED_CLIENT_SECRET."
    );
  }

  return {
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  };
}

function printDepotResult(depotId, result) {
  console.log(`Depot ${depotId}:`);
  console.log(`Tasks: [${result.selectedTaskIds.join(", ")}]`);
  console.log(`Total Duration: ${result.totalDuration}`);
  console.log(`Total Impact: ${result.totalImpact}`);
  console.log("");
}

async function main() {
  let token = null;

  try {
    const { clientID, clientSecret } = getClientCredentials();
    token = await authenticateUser(clientID, clientSecret);

    if (token) {
      await Log("backend", "info", "service", "Scheduler started", token);
    }

    const [depots, vehicles] = await Promise.all([
      getDepotData(token),
      getVehicleData(token),
    ]);

    for (const depot of depots) {
      const result = await solveMaintenanceKnapsack(
        vehicles,
        Number(depot.MechanicHours),
        token
      );

      printDepotResult(depot.ID, result);
    }

    if (token) {
      await Log("backend", "info", "service", "Completed", token);
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message;

    console.error("ERROR:", msg);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  authenticateUser,
  getClientCredentials,
};
