
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    cartData: {
        type: Object,
        default: {}
    },

    // Token pour réinitialiser le mot de passe
    resetPasswordToken: {
        type: String,
        default: null
    },

    // Date d'expiration du token
    resetPasswordExpires: {
        type: Date,
        default: null
    }

}, { minimize: false });

const userModel =
    mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
