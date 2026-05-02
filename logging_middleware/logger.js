const axios = require("axios");

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";
const VALID_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const VALID_PACKAGES = new Set([
  "cache",
  "controller",
  "db",
  "handler",
  "repository",
  "route",
  "service",
]);

async function Log(stack, level, packageName, message, token) {
  if (!token) {
    return;
  }

  if (stack !== "backend") {
    stack = "backend";
  }

  if (!VALID_LEVELS.has(level)) {
    level = "info";
  }

  if (!VALID_PACKAGES.has(packageName)) {
    packageName = "service";
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    message = "No log message provided.";
  }

  const payload = {
    stack,
    level,
    package: packageName,
    message,
  };

  console.log(`[${level.toUpperCase()}] ${message}`);

  try {
    const response = await axios.post(
      LOG_API_URL,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown logging error";

    console.error("[Log failed]", {
      payload,
      status: error.response?.status,
      response: error.response?.data,
      error: errorMessage,
    });

    return {
      failed: true,
      status: error.response?.status,
      response: error.response?.data,
      error: errorMessage,
    };
  }
}

module.exports = {
  Log,
};
