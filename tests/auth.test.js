const AuthController = require('../controllers/authController');
const { expect } = require('chai');
const DatabaseModel = require('../models/databaseModel');

describe('Auth Controller Tests', () => {
    describe('Input Validation (SR-005)', () => {
        it('should reject signup with missing required fields', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'john@doe.com',
                    // missing username
                    password: 'Password123',
                    DOB: '22/02/2004',
                    number: '07823312391'
                }
            };

            await AuthController.postSignup(req, null, (err) => {
                expect(err.message).to.equal('MISSING_BODY_FIELDS');
            });
        });

        it('should reject invalid email format', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'invalid-email',
                    username: 'johndoe',
                    password: 'Password123',
                    DOB: '22/02/2004',
                    number: '07823312391'
                }
            };

            await AuthController.postSignup(req, null, (err) => {
                expect(err.message).to.equal('INVALID_EMAIL_FORMAT');
            });
        });

        it('should reject invalid username format', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'john@doe.com',
                    username: 'jo', // too short
                    password: 'Password123',
                    DOB: '22/02/2004',
                    number: '07823312391'
                }
            };

            await AuthController.postSignup(req, null, (err) => {
                expect(err.message).to.equal('INVALID_USERNAME_FORMAT');
            });
        });

        it('should reject invalid phone number format', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'john@doe.com',
                    username: 'johndoe',
                    password: 'Password123',
                    DOB: '22/02/2004',
                    number: '123' // invalid phone number
                }
            };

            await AuthController.postSignup(req, null, (err) => {
                expect(err.message).to.equal('INVALID_PHONE_NUMBER');
            });
        });
    });

    describe('Password Validation (SR-001)', () => {
        it('should reject password without uppercase letter', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'john@doe.com',
                    username: 'johndoe',
                    password: 'password123',
                    DOB: '22/02/2004',
                    number: '07823312391'
                }
            };

            await AuthController.postSignup(req, null, (err) => {
                expect(err.message).to.equal('INVALID_PASSWORD_FORMAT');
            });
        });

        it('should reject password without number', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'john@doe.com',
                    username: 'johndoe',
                    password: 'Password',
                    DOB: '22/02/2004',
                    number: '07823312391'
                }
            };

            await AuthController.postSignup(req, null, (err) => {
                expect(err.message).to.equal('INVALID_PASSWORD_FORMAT');
            });
        });

        it('should reject password without lowercase letter', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'john@doe.com',
                    username: 'johndoe',
                    password: 'PASSWORD123',
                    DOB: '22/02/2004',
                    number: '07823312391'
                }
            };

            await AuthController.postSignup(req, null, (err) => {
                expect(err.message).to.equal('INVALID_PASSWORD_FORMAT');
            });
        });

        it('should reject password shorter than 8 characters', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'john@doe.com',
                    username: 'johndoe',
                    password: 'Pass1',
                    DOB: '22/02/2004',
                    number: '07823312391'
                }
            };

            await AuthController.postSignup(req, null, (err) => {
                expect(err.message).to.equal('INVALID_PASSWORD_FORMAT');
            });
        });

        it('should accept valid password', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'john@doe.com',
                    username: 'johndoe',
                    password: 'Password123',
                    DOB: '22/02/2004',
                    number: '07823312391'
                },
                session: {}
            };

            const res = {
                redirect: (path) => {
                    expect(path).to.equal('/');
                }
            };

            await AuthController.postSignup(req, res, (err) => {
                expect(err).to.be.undefined;
            });
        });
    });

    describe('Login Validation', () => {
        it('should reject login with invalid credentials', async () => {
            const req = {
                body: {
                    username: 'nonexistent',
                    password: 'wrongpassword'
                },
                session: {}
            };
            const res = {
                render: (view, data) => {
                    expect(data.error).to.equal('Invalid credentials');
                }
            };

            await AuthController.postLogin(req, res, (err) => {
                expect(err).to.be.undefined;
            });
        });

        it('should accept login with valid credentials', async () => {
            const req = {
                body: {
                    username: 'johndoe',
                    password: 'Password123'
                },
                session: {}
            };
            const res = {
                redirect: (path) => {
                    expect(path).to.equal('/');
                }
            };

            await AuthController.postLogin(req, res, (err) => {
                expect(err).to.be.undefined;
            });
        });
    });

    describe('Password Hashing (SR-006)', () => {
        it('should hash password during signup', async () => {
            const req = {
                body: {
                    name: 'John',
                    email: 'john@doe.com',
                    username: 'johndoe',
                    password: 'Password123',
                    DOB: '22/02/2004',
                    number: '07823312391'
                },
                session: {}
            };
            const res = {
                redirect: (path) => {
                    expect(path).to.equal('/');
                }
            };

            await AuthController.postSignup(req, res, async (err) => {
                expect(err).to.be.undefined;
                // Verify the password was hashed
                const user = await DatabaseModel.getUser('johndoe');
                expect(user.password).to.not.equal('Password123');
                expect(user.password).to.match(/^\$2[aby]\$\d+\$/); // bcrypt hash format
            });
        });

        it('should successfully compare correct password during login', async () => {
            const req = {
                body: {
                    username: 'johndoe',
                    password: 'Password123'
                },
                session: {}
            };
            const res = {
                redirect: (path) => {
                    expect(path).to.equal('/');
                }
            };

            await AuthController.postLogin(req, res, (err) => {
                expect(err).to.be.undefined;
            });
        });
    });
});