const request = require('supertest');
const express = require('express');
require('dotenv').config();
const profileRouter = require('../routes/profileRouter');
const userRouter = require('../routes/userRouter');
const app = express();
app.use(express.json());
app.use('/profiles', profileRouter);
app.use('/users', userRouter);

require('./setup');

let profile_id;
describe('Test of User Route', () => {

	test('should be able to register a user', () => {
		return request(app).post('/profiles').send({
			firstName: 'rakesh',
			lastName: 'gyawali',
			address: {
				streetAddress: 'Bishal Chowk',
				cityName: 'Bharatpur-11',
			},
			contact: { 
				mobileNo: '1234567',
				email: 'rakesh@gmail.com',
				phoneNo: '9898',
				hidePhone: 'false'
			},
			profilePhoto: 'myFile-1596799950612.jpeg'
		}).then((res) => {
			profile_id = res.body._id;
			return request(app).post('/users/register')
			.send({
				firstName:'firstname',
				lastName:'lastName',
				username: 'test12346',
				password: 'test1234',
				email: 'test@gmail.com', 
				role: 'admin',
				profile: profile_id,
			}).then((res) => {
				console.log(res.body);
				expect(res.statusCode).toBe(201);
			})
		})
	})

	test('should not be able to register a user', () => {
		return request(app).post('/users/register')
		.send({
			firstName:'firstname',
			lastName:'lastName',
			username: 'sb',
			password: 'test1234',
			email: 'test@gmail.com',
			role: 'admin',
			profile: profile_id,
		}).then((res) => {
			expect(res.statusCode).toBe(400);
		})
	})
})

