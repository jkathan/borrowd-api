const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const borrowdSchema = mongoose.Schema({
	board: {type: String, required: true}
});

borrowdSchema.methods.serialize = function() {
	return {
		board: this.board
	}
}

const Borrowd = mongoose.model('Borrowd', borrowdSchema);