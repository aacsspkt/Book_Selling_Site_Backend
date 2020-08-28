const request = require('supertest');
const express = require('express');
require('dotenv').config();
const userRouter = require('../routes/userRouter');
const categoryRouter = require('../routes/categoryRouter');
const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.use('/categories', categoryRouter);
require('./setup'); 


let token, categoryId;
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

 describe('Test of Category Route', () => {
    test('should be able to POST a category', () => {
		return request(app).post('/categories')
		.set('authorization', token)
		.send({name: 'Non-finction'})
		.then(res => {
			expect(res.statusCode).toBe(201);
			expect(res.body.name).toBe('Non-finction');	
			categoryId = res.body._id;	


		});
	})
	test('should be able to GET array of category', () => {
		return request(app).get('/categories')
		.set('authorization', token)
		.then(res => {
			expect(res.statusCode).toBe(200);
			expect(res.body.[0].name).toBe('Non-finction');		
		});
	})
	test('should be able to GET a category', () => {
		return request(app).get('/categories/' + categoryId)
		.set('authorization', token)
		.then(res => {
			expect(res.statusCode).toBe(200);
			expect(res.body.name).toBe('Non-finction');		
		});
	})
	test('should be able to UPDATE category', () => {
		return request(app).put('/categories/' + categoryId)
		.set('authorization', token)
		.send({name: 'Updated Non-finction'})
		.then(res => {
			expect(res.statusCode).toBe(200);
			expect(res.body.name).toBe('Updated Non-finction');		
		});
	})
	test('should be able to DELETE a category', () => {
		return request(app).delete('/categories/' + categoryId)
		.set('authorization', token)
		.then(res => {
			expect(res.statusCode).toBe(200);
		});
	})

})