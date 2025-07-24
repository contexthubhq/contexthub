export class SnowflakeDataSource {
    id = 'snowflake';
    name = 'Snowflake';
    credentials;
    constructor(credentials) {
        this.credentials = credentials;
    }
    async testConnection() {
        return true;
    }
}
