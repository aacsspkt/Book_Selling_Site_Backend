const request = require('supertest');
const express = require('express');
require('dotenv').config();
const userRouter = require('../routes/userRouter');
const profileRouter = require('../routes/profileRouter');
const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.use('/profiles', profileRouter);

require('./setup'); 

let userId, token;
beforeAll(() => {
    return request(app).post('/users/register')
        .send({
            username: 'test1234',
			password: 'test1234',
			email: 'test@gmail.com'
        })
        .then(res => {
            return request(app).post('/users/login')
                .send({
                    username: 'test1234',
                    password: 'test1234'
                }).then((res) => {
					// console.log(res.body);
					expect(res.statusCode).toBe(200);
					token = res.body.token;
                })
		})
	})


describe('Test of Profile Route due', () => {
    test('should be able to create a profile', () => {
		return request(app).post('/profiles')
		.set('authorization', token)
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
            expect(res.statusCode).toBe(201);
		})
	})

	test('should NOT be able to create a profile due to invalid token', () => {
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
	test('should NOT be able to create a profile due to lack of authentication info', () => {
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
	test('should NOT be able to create a profile due to lack of authentication info', () => {
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
})

	// test('should not be able to create a profile', () => {
	// 	return request(app).post('/profiles').send({
	// 		firstName: 'rakesh'
	// 	}).then(res => {
	// 	expect(res.status).toBe(500);
	// 	})
	// })

	// test('should be able to view profiles', () => {
	// 	return request(app).get('/profiles')
	// 	.then(res => {
	// 		expect(res.status).toBe(200);
	// 	})
	// })

	// test('should be able to update profile', () => {
	// 	return request(app).put(`/profiles/${id}`)
	// 	.send({
	// 		firstName: 'updated'
	// 	})
	// 	.then(res => {
	// 		expect(res.status).toBe(200);
	// 	})
	// })
