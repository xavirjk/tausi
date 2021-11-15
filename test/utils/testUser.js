
const validData = exports.module = {
    firstName: Math.random().toString(36).substring(2,8),
    lastName:  Math.random().toString(36).substring(2,6),
    password:  Math.random().toString(36).substring(2,12),
    email:  `${Math.random().toString(36).substring(2,6)}@${Math.random().toString(36).substring(2,6)}.com`,
    phoneNumber:  Math.random().toString(36).substring(2,8)
}
const inValidData = exports.module = {

    password: Math.random().toString(36).substring(2,5),
    email: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    }
}