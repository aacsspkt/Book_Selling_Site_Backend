const request = require('supertest');
const express = require('express');
require('dotenv').config();
const userRouter = require('../routes/userRouter');
const app = express();
app.use(express.json());
app.use('/users', userRouter);

require('./setup');

let userId;
describe('Test of User Route', () => {
	test('should be able to register a admin', () => {
		return request(app).post('/users/register')
			.send({
				username: 'test12346',
				password: 'test1234',
				email: 'test@gmail.com',
				role: 'admin',
			}).then((res) => {
				expect(res.statusCode).toBe(201);
				expect(res.body.username).toBe('test12346');
				expect(res.body.email).toBe('test@gmail.com');
				expect(res.body.role).toBe('admin');
			})
	})

	test('should be able to register a user', () => {
		return request(app).post('/users/register')
			.send({
				username: '321test',
				password: '321test',
				email: 'test@gmail.com',
				role: 'normal'
			}).then((res) => {
				userId = res.body._id;
				expect(res.statusCode).toBe(201);
				expect(res.body.username).toBe('321test');
				expect(res.body.email).toBe('test@gmail.com');
				expect(res.body.role).toBe('normal');
			})
	})

	test('should NOT be able to register a user with short username, password and email', () => {
		return request(app).post('/users/register')
			.send({
				username: 'te',
				password: 'ps',
				email: 'tem',
			}).then((res) => {
				expect(res.statusCode).toBe(400);
				expect(res.body.message.username).toBe("Username must be between 6 and 30 characters.");
			})
	})
	test('should NOT be able to register a user with no info', () => {
		return request(app).post('/users/register')
			.send({

			}).then((res) => {
				expect(res.statusCode).toBe(400);
			})
	})
	test('should NOT be able to register a user with duplicate username', () => {
		return request(app).post('/users/register')
			.send({
				username: '321test',
				password: '321test',
				email: 'test@gmail.com',
			}).then((res) => {
				expect(res.statusCode).toBe(401);
			})
	})

	test('should be able to login and generate token', () => {
		return request(app).post('/users/login')
			.send({
				username: '321test',
				password: '321test'
			}).then(res => {
				expect(res.statusCode).toBe(200);
				expect(res.body.token).not.toBe('undefined');
			})
	})
	test('should NOT be able to login with non-exist user', () => {
		return request(app).post('/users/login')
			.send({
				username: 'USER-NOT-FOUND',
				password: '321test'
			}).then(res => {
				expect(res.statusCode).toBe(401);
			})
	})
	test('should NOT be able to login with wrong password', () => {
		return request(app).post('/users/login')
			.send({
				username: '321test',
				password: 'WRONG-PASSWORD'
			}).then(res => {
				expect(res.statusCode).toBe(401);
			})
	})
})


