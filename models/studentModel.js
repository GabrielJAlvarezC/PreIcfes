const User = require('./userModel');
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    profesores: {
        type: [mongoose.Schema.objectId],
        ref: "Professor"
    },
}, { discriminatorKey: 'role' });

const Student = User.discriminator("Student", studentSchema);
module.exports = Student;