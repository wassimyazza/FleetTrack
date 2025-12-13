import request from 'supertest';
import app from '../app.js';
import Trailer from '../models/Trailer.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

describe('Trailer Tests', () => {
    let adminToken;
    
    beforeEach(async () => {
        await Trailer.deleteMany({});
        await User.deleteMany({});
        
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await User.create({
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin'
        });
        
        const adminLogin = await request(app)
            .post('/api/login')
            .send({
                email: 'admin@test.com',
                password: 'password123'
            });
        
        adminToken = adminLogin.body.token;
    });
    
    describe('POST /api/trailers', () => {
        
        it('should create a trailer', async () => {
            const res = await request(app)
                .post('/api/trailers')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    plateNumber: 'TRL123',
                    type: 'Flatbed',
                    capacity: 25000
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.plateNumber).toBe('TRL123');
            expect(res.body.type).toBe('Flatbed');
        });
        
        it('should not create trailer with duplicate plate number', async () => {
            await Trailer.create({
                plateNumber: 'TRL123',
                type: 'Flatbed',
                capacity: 25000
            });
            
            const res = await request(app)
                .post('/api/trailers')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    plateNumber: 'TRL123',
                    type: 'Container',
                    capacity: 30000
                });
            
            expect(res.statusCode).toBe(400);
        });
    });
    
    describe('GET /api/trailers', () => {
        
        it('should get all trailers', async () => {
            await Trailer.create([
                { plateNumber: 'TRL123', type: 'Flatbed', capacity: 25000 },
                { plateNumber: 'TRL456', type: 'Container', capacity: 30000 }
            ]);
            
            const res = await request(app)
                .get('/api/trailers')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });
    
    describe('PUT /api/trailers/:id', () => {
        
        it('should update trailer', async () => {
            const trailer = await Trailer.create({
                plateNumber: 'TRL123',
                type: 'Flatbed',
                capacity: 25000
            });
            
            const res = await request(app)
                .put(`/api/trailers/${trailer._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    status: 'in-use'
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('in-use');
        });
    });
    
    describe('DELETE /api/trailers/:id', () => {
        
        it('should delete trailer', async () => {
            const trailer = await Trailer.create({
                plateNumber: 'TRL123',
                type: 'Flatbed',
                capacity: 25000
            });
            
            const res = await request(app)
                .delete(`/api/trailers/${trailer._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
        });
    });
});