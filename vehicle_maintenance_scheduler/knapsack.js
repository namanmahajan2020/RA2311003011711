const { Log } = require("../logging_middleware/logger");

async function solveMaintenanceKnapsack(items, capacity, accessToken) {
  if (accessToken) {
    await Log(
      "backend",
      "info",
      "service",
      "Knapsack started",
      accessToken
    );
  }

  const taskCount = items.length;
  const dp = Array.from({ length: taskCount + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let itemIndex = 1; itemIndex <= taskCount; itemIndex += 1) {
    const currentTask = items[itemIndex - 1];
    const duration = currentTask.Duration;
    const impact = currentTask.Impact;

    for (let currentCapacity = 0; currentCapacity <= capacity; currentCapacity += 1) {
      if (duration <= currentCapacity) {
        const includeImpact =
          impact + dp[itemIndex - 1][currentCapacity - duration];
        const excludeImpact = dp[itemIndex - 1][currentCapacity];

        dp[itemIndex][currentCapacity] = Math.max(includeImpact, excludeImpact);
      } else {
        dp[itemIndex][currentCapacity] = dp[itemIndex - 1][currentCapacity];
      }
    }
  }

  const selectedTasks = [];
  let totalDuration = 0;
  let remainingCapacity = capacity;

  for (let itemIndex = taskCount; itemIndex > 0; itemIndex -= 1) {
    if (dp[itemIndex][remainingCapacity] !== dp[itemIndex - 1][remainingCapacity]) {
      const chosenTask = items[itemIndex - 1];
      selectedTasks.push(chosenTask.TaskID);
      totalDuration += chosenTask.Duration;
      remainingCapacity -= chosenTask.Duration;
    }
  }

  selectedTasks.reverse();

  const result = {
    selectedTaskIds: selectedTasks,
    totalDuration,
    totalImpact: dp[taskCount][capacity],
  };

  if (accessToken) {
    await Log(
      "backend",
      "info",
      "service",
      "Knapsack completed",
      accessToken
    );
  }

  return result;
}

module.exports = solveMaintenanceKnapsack;
