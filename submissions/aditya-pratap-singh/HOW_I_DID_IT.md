# HOW_I_DID_IT

## Overview

I built a Digital Twin Advisor Agent that helps users understand how digital twin systems can be implemented using the SMILE methodology.

The agent accepts a user question, retrieves knowledge from the LPI sandbox using MCP tool calls, and generates recommendations based on the retrieved context.

---

## Steps I Followed

1. I cloned the LPI Developer Kit repository.

2. Installed dependencies and verified the sandbox:

npm install  
npm run build  
npm run test-client  

3. I created a CLI-based AI agent that accepts a digital twin question from the user.

4. The agent queries multiple LPI tools using MCP tool calls:

- query_knowledge  
- get_case_studies  
- get_insights  

5. These tools return knowledge entries, case studies, and implementation insights from the LPI knowledge base.

6. The agent combines the retrieved context and generates a recommendation using the SMILE methodology.

---

## Challenges

Understanding how to structure the workflow between multiple LPI tools while keeping the agent explainable was the main challenge.

Another challenge was designing the agent so that it could retrieve information from multiple sources and combine them into a single coherent recommendation.

---

## Design Choices

Instead of building a generic chatbot, I focused on a Digital Twin Advisor use case.

This allowed the agent to combine knowledge, case studies, and insights to generate practical recommendations for implementing digital twins.

I also designed the agent to clearly show which LPI tools were used, improving explainability.

---

## What I Would Do Differently

If I extended the project further I would:

- return structured JSON outputs for easier integration  
- add automated tests for agent workflows  
- improve parsing of tool responses for richer recommendations  
- build a small web interface for interacting with the agent
