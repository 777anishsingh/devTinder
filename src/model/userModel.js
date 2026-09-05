const mongoose = require('mongoose')
const { Schema } = mongoose
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
        },
        lastName: {
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        age: {
            type: Number,
            validate(value) {
                if (value < 18) {
                    throw new Error("Age is less than 18")
                } else if (value >= 100) {
                    throw new Error("Age is greater than 100")
                }
            }
        },
        gender: {
            type: String,
            lowercase: true,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender not valid")
                }
            }
        },
        password: {
            type: String,
            required: true,


        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        membershipType: {
            type: String
        },
        photoUrl: {
            type: String,
            default: "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Enter a valid photo Url " + value)
                }
            }
        },
        about: {
            type: String,
            default: "This is you about section, Please write about yourself",
            validate(value) {
                if (value.length > 500) {
                    throw new Error("About should be less than 500 characters")
                }
            }
        },
        skills: {
            type: [String],
            validate(value) {
                if (value.length > 10) {
                    throw new Error("Only 10 skills are allowed to enter")
                }
            }
        }
    },
    {
        timestamps: true
    }
);

userSchema.methods.getJWT = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' })
    return token
}

userSchema.methods.validatePassword = async function (passwordByUser) {

    const user = this;
    const hashedPassword = user.password
    const isPasswordValid = await bcrypt.compare(passwordByUser, hashedPassword)

    return isPasswordValid
}

module.exports = mongoose.model('User', userSchema)