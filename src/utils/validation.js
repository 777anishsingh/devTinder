const validator = require('validator')

function signUpValidator(req) {
    const { firstName, lastName, emailId, password, age, photoUrl, gender } = req.body

    if (!firstName || !lastName) {
        throw new Error("Enter a valid Name ")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Enter a valid Email Id ")
    }
    else if (age < 18) {
        throw new Error("Age is less than 18 years")
    }
    else if (age >= 60) {
        throw new Error("Age is greater than 60 years")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a Strong Password ")
    }

}

module.exports = signUpValidator