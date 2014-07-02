exports.IllegalArgumentException = function(message) {
  this.value = "Invalid argument: ";
  this.message = message;
  this.toString = function() {
    return this.value + this.message;
  };
};
exports.Exception = function(message) {
  this.message = message;
  this.toString = function() {
    return this.message;
  };
};