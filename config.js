exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://test:test1234@ds231723.mlab.com:31723/borrowd';
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';