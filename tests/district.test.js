const request = require('supertest');
const express = require('express');
require('dotenv').config();

const userRouter = require('../routes/userRouter');
const districtRouter = require('../routes/districtRouter');

const app = express();
app.use(express.json());

app.use('/users', userRouter);
app.use('/districts', districtRouter);

require('./setup'); 

let token, districtId;
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
		 }) 
	 });
 });

 describe('Test of District Router', () => {
	test('should be able to POST district', () => {
		return request(app).post('/districts')
		.set('authorization', token)
		.send({name: 'Kathmandu'})
		.then(res => {
			expect(res.statusCode).toBe(201);
			districtId = res.body._id;
		});
	})

	test('should NOT be able POST same district', () => {
		return request(app).post('/districts')
		.set('authorization', token)
		.send({name: 'Kathmandu'})
		.then(res => {
			expect(res.statusCode).toBe(403);
		})
	})

	test('should NOT be able POST without token', () => {
		return request(app).post('/districts')
		.set('authorization', token)
		.send({name: 'Kathmandu'})
		.then(res => {
			expect(res.statusCode).toBe(403);
		})
	})

	test('should NOT be able POST district without name', () => {
		return request(app).post('/districts')
		.set('authorization', token)
		.send({name: ''})
		.then(res => {
			expect(res.statusCode).toBe(500); 
		})
	})

	test('should be able to GET districts', () => {
		return request(app).get('/districts')
		.then(res => {
			expect(res.statusCode).toBe(200);
		})
	})

	test('should be able to GET a district', () => {
		return request(app).get('/districts/' + districtId)
		.then(res => {
			expect(res.statusCode).toBe(200);
			expect(res.body.name).toBe("Kathmandu");
		})
	})
	test('should be able to UPDATE a district', () => {
		return request(app).put('/districts/' + districtId)
		.set('authorization', token)
		.send({name: 'Updated'})
		.then(res => {
			expect(res.statusCode).toBe(200);
			expect(res.body.name).toBe("Updated");
		})
	})
	test('should be able to UPDATE a non-exist district', () => {
		return request(app).put('/districts/' + 'WRONG-ID')
		.set('authorization', token)
		.send({name: 'Updated'})
		.then(res => {
			expect(res.statusCode).toBe(500);
		})
	})
	test('should be able to DELETE a district', () => {
		return request(app).delete('/districts/' + districtId)
		.set('authorization', token)
		.then(res => {
			expect(res.statusCode).toBe(200);
		})
	})
	test('should be able to DELETE all districts', () => {
		return request(app).delete('/districts/')
		.set('authorization', token)
		.then(res => {
			expect(res.statusCode).toBe(200);
		})
	})
 })	



 
