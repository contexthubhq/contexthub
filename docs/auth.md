# ContextHub Auth

**Purpose**  
Propose and document the approach to authentication/authorization for the ContextHub **web app** and **MCP server**.

## Background

### Auth in the MCP Protocol

The MCP protocol specifies [OAuth 2.1 for authorization](https://modelcontextprotocol.io/specification/draft/basic/authorization). Many MCP client/server implementations (e.g., Claude clients and popular MCP server providers like Linear, Notion, and Zapier) follow this standard.

### OAuth 2.1 Roles (Mapped to MCP)

| OAuth Role               | Description                                                      | MCP Mapping                               |
| ------------------------ | ---------------------------------------------------------------- | ----------------------------------------- |
| **Resource owner**       | End user who can grant access to data/services                   | The human using the AI chat product/agent |
| **Client**               | App requesting access on behalf of the resource owner            | The AI chat product or agent              |
| **Authorization server** | Authenticates the resource owner, obtains consent, issues tokens | The chosen OAuth/OIDC/IAM provider        |
| **Resource server**      | API hosting protected resources                                  | The MCP server API                        |

### Dynamic client registration (DCR)

The MCP protocol specifies that servers and clients [should support dynamic client registration](https://modelcontextprotocol.io/specification/draft/basic/authorization#dynamic-client-registration). While there is an [RFC](https://datatracker.ietf.org/doc/html/rfc7591) for this method, the adoption of it seems limited by IAM providers. To me it seems that
dynamic client registration is especially important for consumer use cases where you can easily add your Linear or Notion as an MCP server from the Claude UI. However, in company settings,
I believe it would be preferred that companies explicitly register the clients they allow. Starting in July, Claude allows users to specify a custom client ID and client secret when configuring a server that doesn’t support DCR. I would predict both DCR and explicit client registration to both be supported in the future.

## Design Goals

- **Ease of local testing**  
  Make it easy to run ContextHub locally and see value quickly—no complex auth setup before “hello world.”

- **Flexibility**  
  Many organizations already have providers and patterns for authZ/authN. Support a wide range of methods while remaining MCP-compliant.

- **Delegate to third parties**  
  Auth and access control are complex. Prefer offloading to established IAM providers where possible.

- **Leave doors open**
  ContextHub is early. Preserve optionality for future customer auth configurations.

**Trade-off**

The main tradeoff of these design goals is that a lot of the work and decision making involved in setting up a full production-grade system is left to the user.
If we were to be more opinionated and prescriptive, we could make it easier for the user to get a production system running. However, the requirements of enterprise customers,
small startups and vibe coders differ so drastically, it would be very difficult to make an open source project that suits all parties. Later on if ContextHub gains traction,
a cloud version can implement a vibe-coder friendly authentication while the enterprise version can implement an enterprise-friendly one.

## Decisions

### Web App (Admin UI)

**Decision:** For now, do not build auth into the ContextHub admin web app.
Instead, recommend users place the app behind their choice of **reverse proxy / SSO** or **network-based restrictions** (e.g., VPN, IP allowlists).

**Rationale**

- The admin UI typically serves a small set of internal users, whereas the MCP server faces many end users. The strongest auth needs are on the MCP server side.
- Supporting web-app auth would require choosing providers, implementing roles/permissions, and invite flows—none of which are essential to getting a functional MCP server running.
- Deferring web-app auth keeps local testing simple and avoids premature commitment to specific auth stacks.

**If/When We Add Web-App Auth**

- Start with a **simple password gate** as a lightweight option.
- Hosted/cloud or enterprise editions can integrate **SSO/OIDC/SAML** and role-based access control without adding that complexity to OSS.

### MCP server

**Decision:** Support both no auth and OAuth 2.1
**Rationale**

- We want to allow users to test the MCP server locally very easily without worrying about authentication.
- At least for now, OAuth 2.1 is the only authentication method in the MCP protocol, and we want users to be able to deploy ContextHub and have web client users to be able to be authorized.

**Decision:** Implement only the Resource server, delegate the Authorization server to third parties
**Rationale**

- Many IdPs (Okta, Auth0, Microsoft, AWS) allow you to set up an authorization server, and provide authentication, user management, roles and other features.
- We have to implement the resource server in order to authorize access to MCP resources in a secure way.
- If we would want to implement an authorization server, we would have to implement many endpoints and provide a web-based authentication to the users, all of which are quite complicated and difficult to make compliant with all the different auth methods ContextHub customers might want.

**Downsides**

- Auth providers have limited support for dynamic client registration and they all implement it a little differently. The spec says that authorization servers should provide a registration endpoint which clients can use to register themselves, but many providers require and admin access token for that endpoint or require you to use a different admin API to register. I believe most enterprise applications and users will want to explicitly register the clients anyway, and therefore the limited support for DCR is acceptable.

**Decision:** Support JWT access tokens to begin with
Most providers seem to do JWT access tokens instead of opaque access tokens, so we'll support that at first.

**Decision:** Verify issuer, audience and scopes from the access token
The user can set up which OAuth scopes they want to be required in order for the client to access the MCP tools. The user has to set these up in the OAuth provider and they can grant these scopes by role or by user.

## Example flow with Okta

Here I show the high-level outline of how authorizing access to the ContextHub server works with Okta as the authorization server. I will separately write more detailed user-facing instructions.

Note that Okta doesn't support unauthenticated DCR, but rather requires an admin access token. Therefore, here I show a simpler flow where we register the client explicitly in the Okta UI.

**Okta setup (Okta UI)**

1. Set up an authorization server
   - Navigate to Security -> API -> Add authorization server
   - Set audience (mcp.example.ai), scope (mcp:tools) and access policies (for example, grant mcp:tools scope to all users in a certain groups).
2. Register a client application (Claude)
   - Navigate to Applications -> Applications -> Create app integration

**MCP server setup**

1. Find the OAuth endpoints for the authorization server created in step 1
2. Set the appropriate env vars with the information above
3. Run the server

**Connect Claude**
Connect Claude web / desktop using the your MCP endpoint and client id and client secret from step 2 of the Okta setup.
