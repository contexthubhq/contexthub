# ContextHub

Make Claude your data scientist!

ContextHub is the easiest way to connect your data warehouse to AI assistants and agents, and make the LLMs understand not only the structure but also the business context of your data.

### Watch the demo

[![Watch the demo](https://img.youtube.com/vi/i7dXSsm6ULw/0.jpg)](https://www.youtube.com/watch?v=i7dXSsm6ULw)

### Features

- **Simple to try:** Just run `docker-compose up`, connect your warehouse in the UI and you have an MCP server running that AI assistants can use.
- **Add context to your data:** Add contextual information to your tables and columns, define metrics and concepts, and expose them to the AI assistants via the MCP.
- **Generate context automatically:** Develop your own agents or use our pre-built ones to generate context from your documentation, code or any other sources.
- **Production ready auth:** We support 3rd party OAuth providers so you can control access to the MCP.

## Quick start

```
git clone https://github.com/contexthubhq/contexthub.git
cd contexthub
docker-compose up
```

Now visit [http://localhost:3000](http://localhost:3000).

## Data sources

[See README](packages/data-sources)
