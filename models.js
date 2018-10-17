'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const borrowdSchema = mongoose.Schema({
	board: {type: Array,  required: true},
	newId: {type: String, required: true}
});

borrowdSchema.methods.serialize = function() {
	return {
		id: this._id,
		board: this.board,
		newId: this.newId
	};
};

const Borrowd = mongoose.model('Borrowd', borrowdSchema);

module.exports = {Borrowd};