// digital-twin-advisor.ts

import readline from "readline";
import { spawn } from "child_process";

// ── Types ─────────────────────────────────────────

interface ToolResult {
  tool: string;
  data: string;
  ok: boolean;
}

interface AgentConfig {
  mcpPath: string;
  industry: string;
  timeoutMs: number;
}

const DEFAULT_CONFIG: AgentConfig = {
  mcpPath: "../dist/src/index.js",
  industry: "manufacturing",
  timeoutMs: 10000
};

// ── LPI Tool Caller (MCP) ─────────────────────────

function callLPITool(
  toolName: string,
  args: Record<string, unknown>,
  config: AgentConfig
): Promise<string> {

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

    const child = spawn("node", [config.mcpPath]);

    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`Tool ${toolName} timeout`));
    }, config.timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timer);

      if (code !== 0) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });

    child.stdin.write(payload);
    child.stdin.end();

  });
}

// ── Fetch LPI Context ─────────────────────────

async function fetchLPIContext(
  question: string,
  config: AgentConfig
): Promise<ToolResult[]> {

  const calls: Array<[string, Record<string, unknown>]> = [

    ["query_knowledge", { query: question }],

    ["get_case_studies", { industry: config.industry }],

    ["get_insights", { scenario: question }]

  ];

  const results: ToolResult[] = [];

  for (const [tool, args] of calls) {

    try {

      const data = await callLPITool(tool, args, config);

      results.push({
        tool,
        data,
        ok: true
      });

    } catch (err) {

      console.warn(`⚠ ${tool} failed`);

      results.push({
        tool,
        data: "",
        ok: false
      });

    }
  }

  return results;
}

// ── Generate Recommendation (no external API) ─────────────────────────

function generateRecommendation(question: string): string {

  return `
SMILE Recommendation

Simulate
Create a digital representation of the system described in the question.

Monitor
Collect real-time sensor data and operational metrics.

Integrate
Combine multiple data sources into the digital twin model.

Learn
Apply analytics or machine learning to detect patterns.

Execute
Use predictions and insights to optimize system performance.
`;
}

// ── Main Agent ─────────────────────────

async function runAgent(
  question: string,
  config: AgentConfig = DEFAULT_CONFIG
) {

  const trimmed = question.trim();

  if (!trimmed) {
    console.error("Please enter a valid question.");
    return;
  }

  console.log("\nQuestion:", trimmed);

  console.log("\nQuerying LPI tools...\n");

  const toolResults = await fetchLPIContext(trimmed, config);

  console.log("Results from LPI tools:\n");

  toolResults.forEach(({ tool, data, ok }) => {

    console.log(ok ? "✓" : "✗", tool);

    if (ok && data) {
      console.log(data.substring(0, 300));
    }

    console.log("");

  });

  const recommendation = generateRecommendation(trimmed);

  console.log("\n----------------------------------");
  console.log(recommendation);
  console.log("----------------------------------\n");

}

// ── CLI ─────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Ask a digital twin question: ", async (question) => {

  await runAgent(question);

  rl.close();

});
