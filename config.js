exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost:27017/borrowd';
exports.TEST_DATABASE_URL = 
	process.env.TEST_DATABASE_URL || "mongodb://localhost/test-borrowd-app", { useNewUrlParser: true };
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = process.env.JWT_SECRET || 'banana';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';