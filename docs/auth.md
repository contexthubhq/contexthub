# ContextHub auth

## Purpose of this doc

To propose and document the approach we're taking on auth in both the ContextHub web app and the MCP server.

## Background

### Auth in the MCP protocol

At the time of writing, the MCP protocol has chosen to use [OAuth 2.1 for authorization](https://modelcontextprotocol.io/specification/draft/basic/authorization).
Claude seems to be following this standard as do several MCP server providers that I checked (Linear, Notion, and Zapier).

### Roles in OAuth 2.1 authorization

- Resource owner: the end user that can grant access to data / service. In the MCP case this is the human using the AI chat product or agent.
- Client: the client application that wants access to a resource on behalf of the resource owner. In the MCP case this is the AI chat product or agent.
- Authorization server: the service that authenticates the resource owner, obtains consent, and issues tokens to the client.
- Resource server: the API that holds the protected resources. This is the MCP server API.

## Design goals

Most established companies already have auth providers and established patterns they use for authorizing their users to use different services.
We want to be as flexible as possible in supporting all the different authorization methods ContextHub users would want to use while still being compliant
with the MCP protocol. Additionally, as auth and access control is a very complicated problem and since there are plenty of IAM providers who focus solely on that,
we want to delegate as much of auth as possible to third party providers. Lastly, since ContextHub is at such an early stage, we don't have a good understanding
of all the desired customer auth configurations, so at this point is best to leave as many options open to the future as possible.

## Decisions

### Web app

I propose that for now we don't do auth in the ContextHub admin web app, but rather allow users to for example set up a reverse proxy using whatever auth provider they want,
or set up network-based restrictions in front of the app. In a typical setting that I can imagine, there are only a few admin users that interact with the web app
compared to many non-technical users interacting with the MCP server. Therefore, the need for general user-facing authentication, roles and access control is less in the
admin app than the MCP server. If we would decide to take on supporting authentication in the web app, we would have to support a variety of authentication methods,
potentially decide which roles we want to have, build invite flows, all of which are not essential for getting a functional MCP server running.

If we want, we can very easily add simple password-based authentication in front of the web app later as well and a cloud / enterprise implementation can deal
with this problem without needing to fold that code in the open source version.
