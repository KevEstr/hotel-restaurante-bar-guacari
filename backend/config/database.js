const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
        define: {
            hooks: {
                beforeDefine(attributes, options) {
                    if (options.tableName) {
                        options.tableName = options.tableName.toLowerCase();
                    }
                    for (const attribute in attributes) {
                        if (typeof attributes[attribute] === 'object' && attributes[attribute].field) {
                            attributes[attribute].field = attributes[attribute].field.toLowerCase();
                        }
                    }
                }
            }
        }
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
        define: {
            hooks: {
                beforeDefine(attributes, options) {
                    if (options.tableName) {
                        options.tableName = options.tableName.toLowerCase();
                    }
                    for (const attribute in attributes) {
                        if (typeof attributes[attribute] === 'object' && attributes[attribute].field) {
                            attributes[attribute].field = attributes[attribute].field.toLowerCase();
                        }
                    }
                }
            }
        }
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
        define: {
            hooks: {
                beforeDefine(attributes, options) {
                    if (options.tableName) {
                        options.tableName = options.tableName.toLowerCase();
                    }
                    for (const attribute in attributes) {
                        if (typeof attributes[attribute] === 'object' && attributes[attribute].field) {
                            attributes[attribute].field = attributes[attribute].field.toLowerCase();
                        }
                    }
                }
            }
        }
    },
};
