const request = require('supertest');
const express = require('express');
require('dotenv').config();

const userRouter = require('../routes/userRouter');
const profileRouter = require('../routes/profileRouter');
const districtRouter = require('../routes/districtRouter');

const app = express();

app.use(express.json());
app.use('/users', userRouter);
app.use('/profiles', profileRouter);
app.use('/districts', districtRouter);

require('./setup'); 

let profileId, token, districtId;
beforeAll(() => {
   return request(app).post('/users/register')
	.send({
		username: 'test1234',
		password: 'test1234',
		email: 'test@gmail.com',
		role: 'admin' 
	})
	.then(res => {
		return request(app).post('/users/login')
		.send({
			username: 'test1234',
			password: 'test1234'
		}).then(res => {
			token = res.body.token;
			return request(app).post('/districts')
			.set('authorization', token)
			.send({name: 'Chitwan'})
			.then(res => {
				districtId = res.body._id;
			});
		})
	});
});

describe('Test of Profile Router', () => {
    test('should be able to POST a profile', () => {
		return request(app).post('/profiles')
		.set('authorization', token)
		.send({
            firstName: 'rakesh',
            lastName: 'gyawali',
            address: {
                streetAddress: 'Bishal Chowk',
				cityName: 'Bharatpur-11, Chitwan',
				areaLocation: districtId
            },
            contact: { 
                mobileNo: '1234567',
                email: 'rakesh@gmail.com',
                phoneNo: '9898',
                hidePhone: 'false'
            },
			profilePhoto: 'myFile-1596799950612.jpeg',
        }).then(res => {
			expect(res.statusCode).toBe(201);
			profileId = res.body._id;
		})
	})

	test('should NOT be able to POST a profile due to invalid token', () => {
		return request(app).post('/profiles')
		.set('authorization', 'invalid_token')
		.send({
			firstName: 'rakesh',
			lastName: 'gyawali',
			address: {
				streetAddress: 'Bishal Chowk',
				cityName: 'Bharatpur-11, Chitwan',
			},
			contact: { 
				mobileNo: '1234567',
				email: 'rakesh@gmail.com',
				phoneNo: '9898',
				hidePhone: 'false'
			}, 
			profilePhoto: 'myFile-1596799950612.jpeg',
		}).then(res => {
			expect(res.statusCode).toBe(401);
		})
	})
	test('should NOT be able to POST a profile due to lack of authentication info', () => {
		return request(app).post('/profiles')
		.send({
			firstName: 'rakesh',
			lastName: 'gyawali',
			address: {
				streetAddress: 'Bishal Chowk',
				cityName: 'Bharatpur-11, Chitwan',
			},
			contact: { 
				mobileNo: '1234567',
				email: 'rakesh@gmail.com',
				phoneNo: '9898',
				hidePhone: 'false'
			}, 
			profilePhoto: 'myFile-1596799950612.jpeg',
		}).then(res => {
			expect(res.statusCode).toBe(401);
		})
	})
	test('should NOT be able to POST a profile due to lack of authentication info', () => {
		return request(app).post('/profiles')
		.send({
			firstName: 'rakesh',
			lastName: 'gyawali',
			address: {
				streetAddress: 'Bishal Chowk',
				cityName: 'Bharatpur-11, Chitwan',
			},
			contact: { 
				mobileNo: '1234567',
				email: 'rakesh@gmail.com',
				phoneNo: '9898',
				hidePhone: 'false'
			}, 
			profilePhoto: 'myFile-1596799950612.jpeg',
		}).then(res => {
			expect(res.statusCode).toBe(401);
		})
	})
	test('should be able to UPDATE profile', () => {
		return request(app).put('/profiles/' + profileId)
		.send({
			firstName: 'Updated',
			lastName: 'Updated',
		}).then(res => {
			expect(res.statusCode).toBe(200);
		})
	})
	test('should be able to UPDATE profile', () => {
		return request(app).put('/profiles/' + profileId)
		.send({
			firstName: 'Updated',
			lastName: 'Updated',
			address: {
				streetAddress: 'Bishal Chowk',
				cityName: 'Bharatpur-11, Chitwan',
			},
			contact: { 
				mobileNo: '1234567',
				email: 'rakesh@gmail.com',
				phoneNo: '9898',
				hidePhone: 'false'
			}, 
			profilePhoto: 'myFile-1596799950612.jpeg',
		}).then(res => {
			expect(res.statusCode).toBe(200);
		})
	})
	test('should be able to GET profile', () => {
		return request(app).get('/profiles/' + profileId)
		.then(res => {
			expect(res.statusCode).toBe(200)
			expect(res.body.firstName).toBe('Updated');
			expect(res.body.lastName).toBe('Updated');
		});
	})
})
