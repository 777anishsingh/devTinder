const bcrypt = require('bcrypt')

async function passwordHash(password) {
    try {
        return await bcrypt.hash(password, 10)
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = passwordHash