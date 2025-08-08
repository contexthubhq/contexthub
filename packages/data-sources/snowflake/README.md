# Setting up Snowflake for ContextHub

## Overview

Setting up Snowflake for ContextHub involves setting up Snowflake entities (warehouse, user, and role) in the Snowflake console and configuring the Snowflake connection in the ContextHub UI.

We’ll set up the following entities:

- A warehouse, which is a cluster of compute resources in Snowflake. This allows you as a customer to set up whatever limits you want and manage billing separately.
- A role, which defines what privileges ContextHub has.
- A user, which ContextHub uses to access the Snowflake instance.

## Commands

```sql
-- Set variables
set contexthub_role = 'CONTEXTHUB_ROLE';
set contexthub_username = 'CONTEXTHUB_USER';
set contexthub_warehouse = 'CONTEXTHUB_WAREHOUSE';

-- The source database that ContextHub serves to clients (change this).
set source_database = 'SNOWFLAKE_SAMPLE_COPY';

-- Set password (change this)
set contexthub_password = 'password';

begin;

-- Create ContextHub role
use role securityadmin;
create role if not exists identifier($contexthub_role);
grant role identifier($contexthub_role) to role SYSADMIN;

-- Create ContextHub user
create user if not exists identifier($contexthub_username)
password = $contexthub_password
default_role = $contexthub_role
default_warehouse = $contexthub_warehouse;

grant role identifier($contexthub_role) to user identifier($contexthub_username);

-- Change role to sysadmin for warehouse / database steps
use role sysadmin;

-- Create ContextHub warehouse
create warehouse if not exists identifier($contexthub_warehouse)
warehouse_size = large
warehouse_type = standard
auto_suspend = 60
auto_resume = true
initially_suspended = true;

-- grant ContextHub warehouse access
grant USAGE
on warehouse identifier($contexthub_warehouse)
to role identifier($contexthub_role);

-- Grant usage permissions to source database
GRANT USAGE ON DATABASE identifier($source_database) TO ROLE identifier($contexthub_role);
GRANT USAGE ON ALL SCHEMAS IN DATABASE identifier($source_database) TO ROLE identifier($contexthub_role);

-- Grant read access to source database
GRANT SELECT ON ALL TABLES IN DATABASE identifier($source_database) TO identifier($contexthub_role);
GRANT SELECT ON ALL VIEWS IN DATABASE identifier($source_database) TO identifier($contexthub_role);
GRANT SELECT ON ALL MATERIALIZED VIEWS IN DATABASE identifier($source_database) TO identifier($contexthub_role);
GRANT SELECT ON ALL EXTERNAL TABLES IN DATABASE identifier($source_database) TO identifier($contexthub_role);

-- Grant access to future tables, views, etc.
GRANT SELECT ON FUTURE TABLES IN DATABASE identifier($source_database) TO identifier($contexthub_role);
GRANT SELECT ON FUTURE VIEWS IN DATABASE identifier($source_database) TO identifier($contexthub_role);
GRANT SELECT ON FUTURE MATERIALIZED VIEWS IN DATABASE identifier($source_database) TO identifier($contexthub_role);
GRANT SELECT ON FUTURE EXTERNAL TABLES IN DATABASE identifier($source_database) TO identifier($contexthub_role);

commit;
```

## Finding parameters

You can find your account identifier by clicking the “View account details” link here:

<img width="1511" height="830" alt="image (3)" src="https://github.com/user-attachments/assets/e5041157-dccc-4109-b013-411591df6396" />


…where you will find the account identifier:

<img width="1505" height="827" alt="image (5)" src="https://github.com/user-attachments/assets/df52921e-db8d-47b6-8010-4cfec3cb9d45" />
