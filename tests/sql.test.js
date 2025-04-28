const { expect } = require('chai');
const AuthController = require('../controllers/authController');
const DatabaseModel = require('../models/databaseModel');

describe('SQL Injection Prevention Tests', () => {
    describe('Login Endpoint (SR-003)', () => {
        const sqlInjectionAttempts = [
            "' OR '1'='1",
            "' OR '1'='1' --",
            "' OR '1'='1' #",
            "' OR '1'='1'/*",
            "admin' --",
            "admin' #",
            "admin'/*",
            "' UNION SELECT * FROM users --",
            "' UNION SELECT * FROM users #",
            "' UNION SELECT * FROM users/*"
        ];

        sqlInjectionAttempts.forEach(attempt => {
            it(`should reject SQL injection attempt in username: ${attempt}`, async () => {
                const req = {
                    body: {
                        username: attempt,
                        password: 'anypassword'
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
        });
    });

    describe('Search Endpoint (SR-003)', () => {
        const sqlInjectionAttempts = [
            "' OR '1'='1",
            "' UNION SELECT * FROM users --",
            "'; DROP TABLE users; --",
            "'; DELETE FROM users; --",
            "'; UPDATE users SET password = 'hacked'; --"
        ];

        sqlInjectionAttempts.forEach(attempt => {
            it(`should reject SQL injection attempt in search: ${attempt}`, async () => {
                const req = {
                    query: {
                        search: attempt
                    },
                    session: {}
                };
                const res = {
                    render: (view, data) => {
                        expect(data.books).to.be.an('array');
                        expect(data.books.length).to.equal(0);
                    }
                };

                await DatabaseModel.getBooks(req.session.user?.id, attempt, (err) => {
                    expect(err).to.be.undefined;
                });
            });
        });
    });

    describe('User Profile Endpoint (SR-003)', () => {
        const sqlInjectionAttempts = [
            "' OR '1'='1",
            "' UNION SELECT * FROM users --",
            "'; UPDATE users SET role = 'admin' WHERE id = 1; --"
        ];

        sqlInjectionAttempts.forEach(attempt => {
            it(`should reject SQL injection attempt in user ID: ${attempt}`, async () => {
                const req = {
                    params: {
                        id: attempt
                    },
                    session: {}
                };
                const res = {
                    render: (view, data) => {
                        expect(data.user).to.be.undefined;
                    }
                };

                await DatabaseModel.getUser(attempt, (err) => {
                    expect(err).to.be.undefined;
                });
            });
        });
    });

    describe('Media Management Endpoints (SR-003)', () => {
        const sqlInjectionAttempts = [
            "' OR '1'='1",
            "' UNION SELECT * FROM media --",
            "'; DROP TABLE media; --",
            "'; UPDATE media SET numAvail = 999; --"
        ];

        sqlInjectionAttempts.forEach(attempt => {
            it(`should reject SQL injection attempt in media ID: ${attempt}`, async () => {
                const req = {
                    params: {
                        id: attempt
                    },
                    session: {}
                };
                const res = {
                    render: (view, data) => {
                        expect(data.book).to.be.undefined;
                    }
                };

                await DatabaseModel.getBook(attempt, req.session.user?.id, (err) => {
                    expect(err).to.be.undefined;
                });
            });
        });
    });
}); 