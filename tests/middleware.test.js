const { expect } = require('chai');
const { isAuthenticated, isNotAuthenticated, isLibrarian } = require('../middleware/authMiddleware');

describe('Authentication Middleware Tests', () => {
    describe('isAuthenticated (SR-004)', () => {
        it('should allow access when user is authenticated', () => {
            const req = {
                session: {
                    user: {
                        id: 1,
                        username: 'testuser'
                    }
                }
            };
            const res = {};
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            isAuthenticated(req, res, next);
            expect(nextCalled).to.be.true;
        });

        it('should redirect to login when user is not authenticated', () => {
            const req = {
                session: {}
            };
            const res = {
                redirect: (path) => {
                    expect(path).to.equal('/login');
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            isAuthenticated(req, res, next);
            expect(nextCalled).to.be.false;
        });
    });

    describe('isNotAuthenticated (SR-004)', () => {
        it('should allow access when user is not authenticated', () => {
            const req = {
                session: {}
            };
            const res = {};
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            isNotAuthenticated(req, res, next);
            expect(nextCalled).to.be.true;
        });

        it('should redirect to home when user is authenticated', () => {
            const req = {
                session: {
                    user: {
                        id: 1,
                        username: 'testuser'
                    }
                }
            };
            const res = {
                redirect: (path) => {
                    expect(path).to.equal('/');
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            isNotAuthenticated(req, res, next);
            expect(nextCalled).to.be.false;
        });
    });

    describe('isLibrarian (SR-004)', () => {
        it('should allow access when user is a librarian', () => {
            const req = {
                session: {
                    user: {
                        id: 1,
                        username: 'librarian',
                        role: 'l'
                    }
                }
            };
            const res = {};
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            isLibrarian(req, res, next);
            expect(nextCalled).to.be.true;
        });

        it('should deny access when user is not a librarian', () => {
            const req = {
                session: {
                    user: {
                        id: 2,
                        username: 'customer',
                        role: 'c'
                    }
                }
            };
            const res = {
                status: (code) => {
                    expect(code).to.equal(403);
                    return res;
                },
                render: (view, data) => {
                    expect(view).to.equal('error');
                    expect(data.message).to.equal('Access Denied');
                    expect(data.error.status).to.equal(403);
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            isLibrarian(req, res, next);
            expect(nextCalled).to.be.false;
        });

        it('should deny access when user is not authenticated', () => {
            const req = {
                session: {}
            };
            const res = {
                status: (code) => {
                    expect(code).to.equal(403);
                    return res;
                },
                render: (view, data) => {
                    expect(view).to.equal('error');
                    expect(data.message).to.equal('Access Denied');
                    expect(data.error.status).to.equal(403);
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            isLibrarian(req, res, next);
            expect(nextCalled).to.be.false;
        });
    });
});
