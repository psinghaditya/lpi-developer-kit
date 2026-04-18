# HOW_I_DID_IT

## Overview
I built a Digital Twin Advisor Agent that helps users plan digital twin implementations using the SMILE methodology.

The agent accepts a digital twin question and retrieves relevant information using LPI tools.

## Development Steps

1. I cloned the LPI Developer Kit repository.

2. I installed dependencies and verified the sandbox:

npm install
npm run build
npm run test-client

3. I built an agent that accepts a digital twin question.

4. The agent queries multiple LPI tools:

- query_knowledge
- get_case_studies
- get_insights

5. The outputs from these tools are combined to generate recommendations using the SMILE methodology.

## Challenges

Understanding how to structure multiple tool calls while keeping the agent explainable was the main challenge.

## Design Choices

I designed the agent as a Digital Twin Advisor so it could combine knowledge, case studies, and insights to generate practical recommendations.

## Future Improvements

If extended further I would:

- connect directly to the MCP server
- return structured JSON outputs
- add automated tests
