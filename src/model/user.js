const mongoose = require('mongoose')
const { Schema } = mongoose
const validator = require('validator');

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30
        },
        lastName: {
            type: String,
            minLength: 3,
            maxLength: 30

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
            min: 18,
            max: 60


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
            maxLength: 200


        },
        skills: {
            type: [String],

        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema)