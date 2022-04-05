var config = module.exports = {};
config.SMTPHOST = process.env.HOST;
config.SMTPPORT = process.env.DB_PORT;
config.SMTPUSER = process.env.SMTP_USER;
config.SMTPPASSWORD = process.env.PASSWORD;
config.SMTPDATABASE = process.env.DATABASE_STAGING;