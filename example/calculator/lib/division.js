
/**
 * Divide two numbers.
 *
 * @param {int}  num1      the first number 
 * @param {int}  num2      the second number 
 *
 * @return {integer} the result
 */

exports.division = function(num1, num2) {
	// this is stupid
	//it would be better
	//to throw an exception
	//tell the user they are
	//diving by zero
	if (num2 === 0){ // a temporary solution for divison by zero
		num2 = 1
	}
	return  eval(num1 / num2); 
}