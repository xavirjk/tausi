exports.validData = async ()=>{
    return {
    firstName: Math.random().toString(36).substring(2, 8),
    lastName: Math.random().toString(36).substring(2, 6),
    password: Math.random().toString(36).substring(2, 12),
    email: `${Math.random().toString(36).substring(2,6)}@${Math.random().toString(36).substring(2,6)}.com`,
    phoneNumber: Math.floor(Math.random() * (1000000000 - 100000000) + 100000000)
}}
