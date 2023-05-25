const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn, refreshTokenSecret, refreshTokenExpiresIn } = require('../config');

// Controller Methods

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Request Body:', req.body);

        // Check if the email and password are provided
        if (!email || !password) {
            return res.status(400).json({ 
                error: true,
                message: 'Request body incomplete, both email and password are required' 
            });
        }
    
        // Check if the user already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ 
                error: true,
                message: "User already exists"

            });
        }
    
        // Create the user
        const result = await userModel.createUser(email, password);
        if (result.success) {
            const user = result.user;
            return res.json({message: "User created"});
        } else {
            return res.status(500).json({ error: result.error });
        }

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, longExpiry } = req.body;

        // Check if the email and password are provided
        if (!email || !password) {
            return res.status(400).json({ 
                error: true,
                message: 'Request body incomplete, both email and password are required' 
            });
        }

        // Log in the user
        const user = await userModel.loginUser(email, password);

        // Check if login was successful
        if (user) {
            // Generate a new bearer token
            const bearerToken = jwt.sign({ email }, jwtSecret, { expiresIn: jwtExpiresIn });

            // Generate a new refresh token
            const refreshToken = jwt.sign({ email }, refreshTokenSecret, { expiresIn: refreshTokenExpiresIn });

            const response = {
                bearerToken: {
                    token: bearerToken,
                    token_type: 'Bearer',
                    expires_in: jwtExpiresIn
                },
                refreshToken: {
                    token: refreshToken,
                    token_type: 'Refresh',
                    expires_in: refreshTokenExpiresIn
                }
            };

            return res.json(response);
        } else {
            return res.status(401).json({ error: true, message: 'Incorrect email or password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getUser = async (req, res) => {
	try {
		const email = req.params.email;
		const user = await userModel.getUserByEmail(email);
		const authorizedHeader = req.headers.authorization;

		if (!user) {
			return res.status(404).json({ error: true, message: 'User not found' });
		}

		if (!authorizedHeader) {
			return res.json({
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			});
		}

		// Check if the authorization header is in the correct format
		const [bearerKeyword, bearerToken] = authorizedHeader.split(' ');

		if (bearerKeyword !== 'Bearer' || !bearerToken) {
			return res.status(401).json({ error: true, message: 'Invalid authorization header' });
		}

		try {
			const decodedToken = jwt.verify(bearerToken, 'secret');

            // Check if the decoded token belongs to the email
            if (decodedToken.email !== user.email) {
                return res.json({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                });            
            }

			return res.json({
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				dob: user.dob,
				address: user.address
			});
		} catch (error) {
			// Handle token verification errors
            return res.json({
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			});
		}

	} catch (error) {
		console.error('Error retrieving user:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

const putUser = async (req, res) => {
	try {
		const email = req.params.email;
		const user = await userModel.getUserByEmail(email);
		const authorizedHeader = req.headers.authorization;
        const {firstName, lastName, dob, address} = req.body;


        // No user found
		if (!user) {
			return res.status(404).json({ error: true, message: 'User not found' });
		}

        

        // No Bearer Token Found
		if (!authorizedHeader) {
			return res.status(401).json({
				error: true,
                message: "Authorization header ('Bearer token') not found"
		    });

		}
        const [bearerKeyword, bearerToken] = authorizedHeader.split(' ');

		try {
			const decodedToken = jwt.verify(bearerToken, 'secret');

            // Check if the decoded token belongs to the email
            if (decodedToken.email !== user.email) {
                return res.status(401).json({ error: true, message: 'Invalid JWT token' });
            }

            // Check if the token has expired
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
                return res.status(401).json({ error: true, message: 'JWT token has expired' });
            }
        } catch (error) {
			// Handle token verification errors
            return res.json({
                error: true,
                message: "Invalid JWT token"
			});
		}

        const update = await userModel.putUser(email,firstName,lastName,dob,address);

        // User update unsuccessful
        if(!update.success){
            return res.json({error: update.message})
        }

        // user with updated details
        const newUser = await userModel.getUserByEmail(email);

        return res.json({
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            dob: newUser.dob,
            address: newUser.address
        });

        
	} catch (error) {
		console.error('Error retrieving user:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

const refreshBearerToken = async (req, res) => {
	try {
		const { refreshToken } = req.body;

		// Check if the refresh token is provided
		if (!refreshToken) {
			return res.status(400).json({
				error: true,
				message: "Request body incomplete, refresh token required",
			});
		}

		// Verify and decode the refresh token
		let decodedToken;
		try {
			decodedToken = jwt.verify(refreshToken, refreshTokenSecret);
		} catch (error) {
			// Handle token verification errors
			return res.status(401).json({
				error: true,
				message: 'Invalid refresh token',
			});
		}


		// Check if the token has expired
		if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
			return res.status(401).json({
				error: true,
				message: 'Refresh token has expired',
			});
		}

		// Generate a new bearer token
		const bearerToken = jwt.sign(
			{
				email: decodedToken.email,
			},
			jwtSecret,
			{
				expiresIn: jwtExpiresIn,
			}
		);

        // Generate a new refresh token
		const newRefreshToken = jwt.sign(
			{
				email: decodedToken.email,
			},
			refreshTokenSecret,
			{
				expiresIn: refreshTokenExpiresIn,
			}
		);

		return res.json({
			bearerToken: {
				token: bearerToken,
				token_type: 'Bearer',
				expires_in: jwtExpiresIn,
			},
			refreshToken: {
				token: newRefreshToken,
				token_type: 'Refresh',
				expires_in: refreshTokenExpiresIn,
			},
		});
        
	} catch (error) {
		console.error('Error refreshing bearer token:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    putUser,
    refreshBearerToken
};