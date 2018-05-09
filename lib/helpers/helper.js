var helper = {};

helper.createRandomString = function (strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0
        ? strLength
        : false;
    if (strLength) {
        // Define all the possible characters that could go into a string
        var possibleCharacters = 'abcdef0123456789';

        // Start the final string
        var str = '';
        for (i = 1; i <= strLength; i++) {
            // Get a random charactert from the possibleCharacters string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the string
            str += randomCharacter;
        }
        // Return the final string
        return str;
    } else {
        return false;
    }
};


module.exports = helper;