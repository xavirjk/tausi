var userModel = require("../models/users");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var {
    validData
} = require('./utils/testUser')
const {
    expect,
    assert
} = require("chai");

before(() => {
    mongoose.connect('mongodb://localhost/test', {
        useNewUrlParser: true
    });
});

const setDB = async (data) => {
    /**
     * Inputs the test data in the db for testing to take place.
     */
    var data = data;
    var user = new userModel(data);

    let result = await user.save();
    return result;
}

describe('testConnection', function () {
    it("DB has been connected successfully", () => {
        mongoose.connection.on('error', () => {
            throw new Error("Unable to connect to the Database")
        });
    });
    it("Testing has started", function () {
        expect(true).to.be.equal(true);
    });
});

describe('testValidity', async function () {
    it('firstName has a valid value', async () => {
        var data = await validData();
        var result = await setDB(data);

        expect(data.firstName.toLowerCase()).to.be.equal(result.firstName);
        expect(result.firstName, 'the first Name has no value').to.be.a('string');
    });

    it('lastName is has a valid value', async () => {
        var data = await validData();
        var result = await setDB(data);
        expect(data.lastName.toLowerCase()).to.be.equal(result.lastName);
        expect(result.lastName, 'the last name should be a string').to.be.a('string');
    });

    it('phoneNumber is has a valid value', async () => {
        try {
            var data = await validData();
            var result = await setDB(data);

            expect(data.phoneNumber).to.be.equal(result.phoneNumber);
            var number = parseInt(result.phoneNumber)

            expect(number, 'the phone number should be a Number').to.be.a('Number');
        } catch (error) {
            console.log("caught the error while trying to convert number")
        }

    });

    it('password operations are valid', async () => {
        var data = await validData();
        var result = await setDB(data);

        expect(data.password).to.not.equal(result.password);
        var passwordVal = await bcrypt.compare(data.password, result.password)
        expect(passwordVal).to.be.equal(true);
    });

    it('check for the default values to be false', async () => {
        var data = await validData();
        var result = await setDB(data);
        expect(result.registered.status).to.equal(false);
        expect(result.deleted.status).to.be.equal(false);
        expect(result.password).to.be.not.equal(data.password)

    });

});

describe('testInvalidity', async function () {

    it('firstName is required.', async () => {
        try {
            var data = await validData();
            data['firstName'] = null;
            await setDB(data);
        } catch (error) {
            expect(error.errors.firstName.kind, 'the first Name is required').to.be.equal('required');
        }
    });

    it('lastName is required', async () => {
        try {
            var data = await validData();
            data['lastName'] = null;
            await setDB(data);
        } catch (error) {
            expect(error.errors.lastName.kind, 'the last Name is required').to.be.equal('required');
        }
    });

    it('phoneNumber is valid number', async () => {
        var data = await validData();
        data['phoneNumber'] = (await validData()).firstName;
        try {
            await setDB(data);
        } catch (error) {
            expect(error.errors.phoneNumber.kind).to.be.equal('Number')
        }

    });

    it('password has a length greater than 8', async () => {
        var data = await validData();
        data['password'] = Math.random().toString(36).substring(2, 5)
        try {
            await setDB(data);
        } catch (error) {
            expect(error).to.be.equal('password.length < 8')
        }
    });

    it('default values are not tampered with', async () => {
        var data = await validData();
        data['registered.status'] = true;
        data['deleted.status'] = true;
        try {
            var results = await setDB(data)
            expect(results.registered.status).to.be.equal(false)
            expect(results.deleted.status).to.be.equal(false)
        } catch (error) {
            console.log(error)
            expect(error).to.be.equal(null)
        }
    });

    it('Return error when we have a duplicate in the data', async () => {
        var data = await validData()
        try {
            await setDB(data)
            expect(await setDB(data)).to.throw('The user already exists')
        } catch (error) {
            // console.log(error)
            expect(error).to.equal('The user already exists')
        }
    });

    it('Return error if email and phone Number do not exist', async () => {
        try {
            var data = await validData()
            data['email'] = null
            data['phoneNumber'] = null

            await setDB(data)
        } catch (error) {
            // console.log(error)
            expect(error).to.equal('input phoneNumber and/or email')
        }
    });
});

describe('testing hooks', async () => {
    beforeEach(async () => {
        await userModel.deleteMany({})
    });

    it('test the pre-save hook with valid data ', async function () {
        var data = await validData()
        await setDB(data)
        var result = await userModel.find({})
        expect(result.length).to.be.equal(1)
    });

    it('test the pre-save hooks with invalid data', async () => {
        var data = await validData()
        data['email'] = null
        data['phoneNumber'] = null
        try {
            await setDB(data)
        } catch (error) {
            var result = await userModel.find({})
            expect(result.length).to.be.equal(0)
        }
    });
    it('pre-update should not allow password update');
    it('pre-update should not allow an email update');
});

describe('testing methods', async () => {
    it('test the sendcode mail');
});

describe('testing statics', async () => {

    it('test the find by email function', async () => {
        var data = await validData();

        await setDB(data);
        var results = await userModel.findByEmail(
            data.email
        );
        try {
            let expected_keys = ['registered', '_id', "firstName", 'lastName', 'email', 'phoneNumber']
            let keys = Object.keys(results.toObject())

            expect(keys).to.have.members(expected_keys)
        } catch (error) {
            assert.fails(error)
        }

    })
    it('test the correct authentication function', async () => {
        var data = await validData();
        await setDB(data);
        try {
            var results = await userModel.authenticate(data.email, data.password)
            expect(results).to.be.not.equal(false)
            let expected_keys = ['registered', '_id', "firstName", 'lastName', 'email', 'phoneNumber']
            let keys = Object.keys(results.toObject())

            expect(keys).to.have.members(expected_keys)
        } catch (error) {
            assert.fail(error)
        }
    })

    it('test the incorrect authentication function', async () => {
        var data = await validData();
        await setDB(data);
        try {
            var results = await userModel.authenticate(data.email, data.firstName)

            expect(results).to.be.equal(false)
        } catch (error) {
            assert.fail(error);
        }
    })

    it('test the delete user function', async () => {
        var data = await validData();

        await setDB(data);
        try {
            var result = await userModel.deleteUser(data.email)
            var keys = Object.keys(result.toObject())

            expect(keys).to.have.members(['deleted','_id'])
            expect(result.deleted.status).to.be.equal(true)
        } catch (error) {
            assert.fail(`${error}`)
        }
    })

    it('test the update password function')

    it('test the find by phone Number function', async () => {
        var data = await validData();

        await setDB(data);
        var results = await userModel.findByPhoneNumber(
            data.phoneNumber
        );
        try {
            let expected_keys = ['registered', '_id', "firstName", 'lastName', 'email', 'phoneNumber']
            let keys = Object.keys(results.toObject())

            expect(keys).to.have.members(expected_keys)
        } catch (error) {
            assert.fail(error)
        }
    })
})

after(async () => {
    try {
        await userModel.deleteMany({})
        await mongoose.connection.close()
    } catch (error) {
        console.log("Cannot close the database Connection");
    }

})