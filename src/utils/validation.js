const validator = require('validator')

function signUpValidator(req) {
    const { emailId, password } = req.body

    if (!validator.isEmail(emailId)) {
        throw new Error("Enter a valid Email Id ")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a Strong Password ")
    }
}

function editProfileValidation(req) {
    const userInputFields = req.body
    const editableFields = [
        'firstName',
        'lastName',
        'age',
        "gender",
        'skills',
        'about',
        'photoUrl',]

    const isEditAllowed = Object.keys(userInputFields).every((fields) =>
        editableFields.includes(fields)
    )
    return isEditAllowed
}

function editPasswordValidation(req) {
    const userInputFields = req.body
    const editableFields = ['password', 'newPassword', 'confirmNewPassword']

    const isEditAllowed = Object.keys(userInputFields).every((fields) =>
        editableFields.includes(fields)
    )
    return isEditAllowed
}

async function newPasswordValidation(req) {
    const { password, newPassword, confirmNewPassword } = req.body

    if (password === newPassword) {
        throw new Error("Current password and new password can not be same");
    }

    if (newPassword !== confirmNewPassword) {
        throw new Error("New password and confirm password does not match")
    }

    if (!editPasswordValidation(req)) {
        throw new Error("Only Password field edit allowed")
    }

    const isCurrentPasswordValid = await req.user.validatePassword(password)
    if (!isCurrentPasswordValid) {
        throw new Error("Current password does not match")
    }

    const isNewPasswordStrong = validator.isStrongPassword(newPassword)
    if (!isNewPasswordStrong) {
        throw new Error("Enter a strong password")
    }
}


module.exports = { signUpValidator, editProfileValidation, newPasswordValidation }