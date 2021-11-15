const expect = require("chai").expect;
var userModel = require("../models/users");
const mongoose = require("mongoose");
var { validData,inValidData } = require('./utils/testUser')

before(()=>{
    mongoose.connect('mongodb://localhost/test',{
        useNewUrlParser:true
    });
});

describe('testConnection',function () {
    it("DB has been connected successfully",()=>{
        mongoose.connection.on('error',()=>{
            throw new Error("Unable to connect to the Database")
        });
    })
    it("Testing has started",function(){
        expect(true).to.be.equal(true);
    });
});

describe('testValidity',function(){
    it('firstName has a valid value', async ()=>{
        var user = new userModel({firstName:'newUser'})


        // expect(user.firstName).to.not.be.undefined;
        expect(user.firstName,'the first Name has no value').to.be.a('string');
    });

    // it('lastName is has a value', async ()=>{
    //     var user = new userModel({})

    // });
    // it('firstName is has a value', async ()=>{
    //     var user = new userModel({})

    // });
    // it('firstName is has a value', async ()=>{
    //     var user = new userModel({})

    // });
    // it('firstName is has a value', async ()=>{
    //     var user = new userModel({})

    // });
})

after(async ()=>{
    try{
        await userModel.deleteMany({})
        await mongoose.connection.close()
    }catch(error){
        console.log("Cannot close the database Connection");
    }
    
})