const request = require('supertest');
const express = require('express');
require('dotenv').config();
const profileRouter = require('../routes/profileRouter');
const app = express();
app.use(express.json());
app.use('/profiles', profileRouter);

require('./setup');

let id;
describe('Test of User Route', () => {

    test('should be able to create a profile', () => {
        return request(app).post('/profiles').send({
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
            profilePhoto: 'myFile-1596799950612.jpeg'
        }).then((res) => {
			id = res.body._id;
            expect(res.statusCode).toBe(201);
		})
	})
	test('should not be able to create a profile', () => {
		return request(app).post('/profiles').send({
			firstName: 'rakesh'
		}).then(res => {
		expect(res.status).toBe(500);
		})
	})

	test('should be able to view profiles', () => {
		return request(app).get('/profiles')
		.then(res => {
			expect(res.status).toBe(200);
		})
	})

	test('should be able to update profile', () => {
		return request(app).put(`/profiles/${id}`)
		.send({
			firstName: 'updated'
		})
		.then(res => {
			expect(res.status).toBe(200);
		})
	})
})
