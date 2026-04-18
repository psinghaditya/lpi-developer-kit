import readline from "readline";
import { spawn } from "child_process";

// Call an LPI MCP tool
function callLPITool(toolName, args) {
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
    let output = "";
    let error = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(error);
      } else {
        resolve(output);
      }
    });
    child.stdin.write(payload);
    child.stdin.end();
  });
}
// Agent workflow
async function runAgent(question) {

  if (!question || question.trim() === "") {
    console.log("Please enter a valid digital twin question.");
    return;
  }
  console.log("\nUser Question:", question);
  console.log("\nCalling LPI tools...\n");
  try {
    const knowledge = await callLPITool(
      "query_knowledge",
      { query: question }
    );

    const caseStudy = await callLPITool(
      "get_case_studies",
      { industry: "manufacturing" }
    );

    const insight = await callLPITool(
      "get_insights",
      { scenario: question }
    );
    console.log("Knowledge:");
    console.log(knowledge);
    console.log("\nCase Study:");
    console.log(caseStudy);
    console.log("\nInsight:");
    console.log(insight);
    console.log("\nRecommendation:");
    console.log("1. Start with the SMILE Reality Emulation phase.");
    console.log("2. Model the system digitally.");
    console.log("3. Monitor sensor data streams.");
    console.log("4. Apply analytics to detect patterns.");
    console.log("5. Use insights to optimize system performance.");
  } catch (err) {
    console.log("Error calling LPI tools:");
    console.log(err);

  }
}
// CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Ask a digital twin question: ", async (question) => {
  await runAgent(question);
  rl.close();
});
