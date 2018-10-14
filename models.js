const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const borrowdSchema = mongoose.Schema({
	board: [{type: Array, required: true}]
});

borrowdSchema.methods.serialize = function() {
	return {
		board: this.board
	};
};

const Borrowd = mongoose.model('Borrowd', borrowdSchema);

module.exports = {Borrowd};