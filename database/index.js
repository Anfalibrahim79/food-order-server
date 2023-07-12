const mongoose = require('mongoose');
const { dbUri, dbPassword } = require('../app/config');

const connectDb = dbUri.replace('<password>', dbPassword)

mongoose.connect(connectDb)

const db = mongoose.connection

module.exports = db