const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON } = require("./plugins");
var mongoosePaginate = require("mongoose-paginate");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    alternatePhone: String,
    password: String,
    // apiKeySecret: String,
    emailVerificationStatus: { type: Boolean, default: false },
    isStatus: { type: Number, default: 1 }, //0 is Inactive, 1 is Active
    isDelete: { type: Number, default: 1 }, //0 is delete, 1 is Active
  },
  {
    timestamps: true,
  }
);





/**
 * Check if name is taken
 * @param {string} name - The user's name
 * @param {ObjectId} [excludeCompanyId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
// userSchema.statics.isNameTaken = async function (name, excludeCompanyId) {
//   const company = await this.findOne({ name, _id: { $ne: excludeCompanyId } });
//   return !!company;
// };



/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password.toString(), user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;
