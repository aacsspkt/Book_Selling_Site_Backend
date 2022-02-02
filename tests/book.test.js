const request = require('supertest');
const express = require('express');
require('dotenv').config();

const userRouter = require('../routes/userRouter');
const profileRouter = require('../routes/profileRouter');
const districtRouter = require('../routes/districtRouter');
const categoryRouter = require('../routes/categoryRouter');
const bookRouter = require('../routes/bookRouter');

const app = express();

app.use(express.json());
app.use('/users', userRouter);
app.use('/districts', districtRouter);
app.use('/profiles', profileRouter);
app.use('/categories', categoryRouter);
app.use('/books', bookRouter);

require('./setup');

let profileId_admin, categoryId, adminToken, bookId, districtId;

beforeAll(() => {
	return request(app)
		.post('/users/register')
		.send({ username: 'test1234', password: 'test1234', email: 'test@gmail.com', role: 'admin' })
		.then(res => {
			return request(app)
				.post('/users/login')
				.send({ username: 'test1234', password: 'test1234' })
				.then(res => {
					adminToken = res.body.token;
					return request(app)
						.post('/districts')
						.set('authorization', adminToken)
						.send({ name: 'Chitwan' })
						.then(res => {
							districtId = res.body._id;
							return request(app)
								.post('/profiles')
								.set('authorization', adminToken)
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
									profilePhoto: 'myFile-1596799950612.jpeg'
								}).then(res => {
									profileId_admin = res.body._id;
									return request(app).post('/categories')
										.set('authorization', adminToken)
										.send({ name: 'Non-finction' })
										.then(res => {
											categoryId = res.body._id;
											//register normal user to test Verify-Admin

										});
								})
						});
				});
		});
});

describe('Test of Book Router', () => {
	test('should be able to POST book', () => {
		return request(app)
			.post('/books')
			.set('authorization', adminToken)
			.send({
				title: "Harry Potter",
				author: "Rakesh",
				publication: "Publication1",
				image: "myFile-1598273994348.png",
				condition: "New",
				deliveryArea: "Within city",
				cost: 123,
				category: categoryId,
				owner: profileId_admin
			})
			.then(res => {
				bookId = res.body._id;
				console.log(res)
				expect(res.statusCode).toBe(201);
			})
	});

	test('should be able to GET all books', () => {
		return request(app)
			.get('/books')
			.then(res => {
				expect(res.statusCode).toBe(200);
				expect(res.body).not.toBe(undefined);
			})
	});

	test('should be able to GET a book', () => {
		return request(app)
			.get('/books/' + bookId)
			.then(res => {
				expect(res.statusCode).toBe(200);
				expect(res.body._id).toBe(bookId);
			})
	})
	test('should be able to UPDATE a book', () => {
		return request(app)
			.put('/books/' + bookId)
			.set('authorization', adminToken)
			.send({
				title: "Updated",
				author: "Updated",
				publication: "Updated",
				image: "myFile-1598273994348.png",
				condition: "New",
				deliveryArea: "Within city",
				cost: 123,
				category: categoryId,
				owner: profileId_admin
			})
			.then(res => {
				expect(res.statusCode).toBe(200);
				expect(res.body.title).toBe("Updated");
			})
	})
	test('should be able to DELETE a book', () => {
		return request(app)
			.delete('/books/' + bookId)
			.set('authorization', adminToken)
			.then(res => {
				expect(res.statusCode).toBe(200);
				expect(res.body._id).toBe(bookId);
			})
	})

})
