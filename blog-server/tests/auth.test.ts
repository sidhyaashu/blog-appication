import { expect } from 'chai';
import sinon from 'sinon';
import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, googleAuth } from '../src/controllers/authController.js';
import User from '../src/models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let userFindOneStub: sinon.SinonStub;
  let userCreateStub: sinon.SinonStub;
  let userSaveStub: sinon.SinonStub;
  let bcryptGenSaltStub: sinon.SinonStub;
  let bcryptHashStub: sinon.SinonStub;
  let bcryptCompareStub: sinon.SinonStub;
  let jwtSignStub: sinon.SinonStub;
  let jwtVerifyStub: sinon.SinonStub;
  let oAuth2ClientStub: sinon.SinonStub;

  beforeEach(() => {
    req = {};
    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = { status: statusStub };
    next = sinon.stub().returns(undefined);

    userFindOneStub = sinon.stub(User, 'findOne');
    userCreateStub = sinon.stub(User, 'create');
    userSaveStub = sinon.stub(User.prototype, 'save');
    bcryptGenSaltStub = sinon.stub(bcrypt, 'genSalt');
    bcryptHashStub = sinon.stub(bcrypt, 'hash');
    bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    jwtSignStub = sinon.stub(jwt, 'sign');
    jwtVerifyStub = sinon.stub(jwt, 'verify');
    oAuth2ClientStub = sinon.stub(OAuth2Client.prototype, 'verifyIdToken');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      userFindOneStub.returns(null);
      bcryptGenSaltStub.returns('salt');
      bcryptHashStub.returns('hashedPassword');
      jwtSignStub.returns('token');
      userCreateStub.returns({ _id: '1', name: 'Test User', email: 'test@example.com', role: 'user' });

      await registerUser(req as Request, res as Response);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(jsonStub.calledWith({
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        token: 'token',
      })).to.be.true;
    });

    it('should return 400 if user already exists', async () => {
      req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      userFindOneStub.returns({ _id: '1', email: 'test@example.com' });

      await registerUser(req as Request, res as Response);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({ message: 'User already exists' })).to.be.true;
    });

    it('should return 500 for server error', async () => {
      req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      userFindOneStub.throws(new Error('Database error'));

      await registerUser(req as Request, res as Response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonStub.calledWith({ message: 'Server error' })).to.be.true;
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      userFindOneStub.returns({ _id: '1', email: 'test@example.com', password: 'hashedPassword', role: 'user' });
      bcryptCompareStub.returns(true);
      jwtSignStub.returns('token');

      await loginUser(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith({
        _id: '1',
        name: undefined,
        email: 'test@example.com',
        role: 'user',
        token: 'token',
      })).to.be.true;
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      userFindOneStub.returns({ _id: '1', email: 'test@example.com', password: 'hashedPassword' });
      bcryptCompareStub.returns(false);

      await loginUser(req as Request, res as Response);

      expect(statusStub.calledWith(401)).to.be.true;
      expect(jsonStub.calledWith({ message: 'Invalid email or password' })).to.be.true;
    });

    it('should return 500 for server error', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      userFindOneStub.throws(new Error('Database error'));

      await loginUser(req as Request, res as Response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonStub.calledWith({ message: 'Server error' })).to.be.true;
    });
  });

  describe('googleAuth', () => {
    it('should authenticate with Google successfully and register new user', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test_client_id';
      req.body = { token: 'google_id_token' };
      oAuth2ClientStub.returns({
        getPayload: () => ({
          email: 'google@example.com',
          name: 'Google User',
          sub: 'google123',
        }),
      });
      userFindOneStub.returns(null);
      userCreateStub.returns({ _id: '2', name: 'Google User', email: 'google@example.com', role: 'user', googleId: 'google123' });
      jwtSignStub.returns('google_token');

      await googleAuth(req as Request, res as Response);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(jsonStub.calledWith({
        _id: '2',
        name: 'Google User',
        email: 'google@example.com',
        role: 'user',
        token: 'google_token',
      })).to.be.true;
    });

    it('should authenticate with Google successfully and login existing user', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test_client_id';
      req.body = { token: 'google_id_token' };
      oAuth2ClientStub.returns({
        getPayload: () => ({
          email: 'google@example.com',
          name: 'Google User',
          sub: 'google123',
        }),
      });
      userFindOneStub.returns({ _id: '2', name: 'Google User', email: 'google@example.com', role: 'user', googleId: 'google123', save: userSaveStub });
      jwtSignStub.returns('google_token');

      await googleAuth(req as Request, res as Response);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(jsonStub.calledWith({
        _id: '2',
        name: 'Google User',
        email: 'google@example.com',
        role: 'user',
        token: 'google_token',
      })).to.be.true;
    });

    it('should return 400 for invalid token in Google Auth', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test_client_id';
      req.body = { token: 'invalid_token' };
      oAuth2ClientStub.returns({
        getPayload: () => null,
      });

      await googleAuth(req as Request, res as Response);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({ message: 'Invalid token' })).to.be.true;
    });

    it('should return 500 for Google Auth server error', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test_client_id';
      req.body = { token: 'google_id_token' };
      oAuth2ClientStub.throws(new Error('Google API error'));

      await googleAuth(req as Request, res as Response);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith({ message: 'Google Auth Failed' })).to.be.true;
    });

    it('should update user with googleId if user exists without one', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test_client_id';
      req.body = { token: 'google_id_token' };
      oAuth2ClientStub.returns({
        getPayload: () => ({
          email: 'google@example.com',
          name: 'Google User',
          sub: 'google123',
        }),
      });
      const existingUser = { _id: '2', name: 'Google User', email: 'google@example.com', role: 'user', googleId: undefined, save: userSaveStub };
      userFindOneStub.returns(existingUser);
      userSaveStub.resolves(existingUser);
      jwtSignStub.returns('google_token');

      await googleAuth(req as Request, res as Response);

      expect(existingUser.googleId).to.equal('google123');
      expect(userSaveStub.calledOnce).to.be.true;
      expect(statusStub.calledWith(201)).to.be.true;
    });
  });
});
