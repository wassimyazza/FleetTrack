import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

describe('Authentication Tests', () => {
    
    beforeEach(async () => {
        await User.deleteMany({});
    });
    
    describe('POST /api/register', () => {
        
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe('john@example.com');
            expect(res.body.user.role).toBe('chauffeur');
        });
        
        it('should return error when firstname is missing', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({
                    lastname: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(400);
            expect(Array.isArray(res.body)).toBe(true);
        });
        
        it('should return error when email already exists', async () => {
            await User.create({
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
                password: 'hashedpassword',
                role: 'chauffeur'
            });
            
            const res = await request(app)
                .post('/api/register')
                .send({
                    firstname: 'Jane',
                    lastname: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('This email already exict!');
        });
        
        it('should return error when all fields are missing', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({});
            
            expect(res.statusCode).toBe(400);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(4);
        });
    });
    
    describe('POST /api/login', () => {
        
        beforeEach(async () => {
            await request(app)
                .post('/api/register')
                .send({
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });
        });
        
        it('should login successfully with valid credentials', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({
                    email: 'john@example.com',
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.message).toBe('Login successfuly!');
        });
        
        it('should return error with invalid email', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid Email or Password');
        });
        
        it('should return error with invalid password', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({
                    email: 'john@example.com',
                    password: 'wrongpassword'
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid Email or Password');
        });
        
        it('should return error when email is missing', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(400);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
});