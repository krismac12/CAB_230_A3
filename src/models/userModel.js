const db = require('../db');

// userModel exports

module.exports = {
    getUserByEmail: async (email) => {
        return db('users').where('email', email).first();
    },


    createUser: async (email, password) => {
        const newUser = {
          email: email,
          password: password
        };
        try {
            await db('users').insert(newUser);
            return {
                success: true,
                message: "User created"
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to create user'
            };
        }
    },

    loginUser: async (email, password) => {
        const user = await db('users').where('email', email).first();
    
        if (!user) {
            return null; // User not found
        }
    
        if (user.password !== password) {
            return null; // Invalid password
        }
    
        return user; // Successful login, return the user object
    },

    putUser: async (email, firstName, lastName, dob, address) => {
        try {
            const user = await module.exports.getUserByEmail(email);

            if (!user) {
                return { success: false, message: 'User not found' }; 
            }

            // Update the user's values
            user.firstName = firstName;
            user.lastName = lastName;
            user.dob = dob;
            user.address = address;

            // Save the updated user
            await db('users').where('email', email).update(user);

            return { success: true, message: 'User updated successfully' };
        } catch (error) {
            return { success: false, message: 'Failed to update user' };
        }
    }
}