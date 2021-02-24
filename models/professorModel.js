const User = require('./userModel');
const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    estudiantes: {
        type: [mongoose.Schema.objectId],
        ref: "Student"
    },
    materias: {
        type: String
    }
}, { discriminatorKey: 'role' });

const Professor = User.discriminator("Professor", professorSchema);

module.exports = Professor;