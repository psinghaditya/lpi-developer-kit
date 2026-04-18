import readline from "readline";
import { spawn } from "child_process";

// ─────────────────────────────────────────
// LPI MCP Tool Caller
// ─────────────────────────────────────────

function callLPITool(toolName: string, args: any): Promise<string> {
  return new Promise((resolve, reject) => {

    const payload = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args
      }
    });

    const child = spawn("node", ["../dist/src/index.js"]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });

    child.stdin.write(payload);
    child.stdin.end();
  });
}

// ─────────────────────────────────────────
// Agent Workflow
// ─────────────────────────────────────────

async function runAgent(question: string) {

  if (!question || question.trim() === "") {
    console.log("Please enter a valid digital twin question.");
    return;
  }

  console.log("\nUser Question:", question);
  console.log("\nCalling LPI tools...\n");

  try {

    // LPI TOOL 1
    const knowledge = await callLPITool(
      "query_knowledge",
      { query: question }
    );

    // LPI TOOL 2
    const caseStudies = await callLPITool(
      "get_case_studies",
      { industry: "manufacturing" }
    );

    // LPI TOOL 3
    const insights = await callLPITool(
      "get_insights",
      { scenario: question }
    );

    console.log("Knowledge:");
    console.log(knowledge);

    console.log("\nCase Studies:");
    console.log(caseStudies);

    console.log("\nInsights:");
    console.log(insights);

    console.log("\nSMILE Recommendation:");

    console.log("Simulate → Create a digital representation of the system.");
    console.log("Monitor → Collect real-time operational data.");
    console.log("Integrate → Combine data from sensors and operational systems.");
    console.log("Learn → Apply analytics and machine learning to identify patterns.");
    console.log("Execute → Optimize system performance based on insights.");

  } catch (error) {

    console.log("Error calling LPI tools:");
    console.log(error);

  }
}

// ─────────────────────────────────────────
// CLI Interface
// ─────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Ask a digital twin question: ", async (question) => {

  await runAgent(question);

  rl.close();

});
