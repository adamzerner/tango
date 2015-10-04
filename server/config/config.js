module.exports = process.env.NODE_ENV === 'production' ? require('./config.prod.json') : require('./config.dev.json');
