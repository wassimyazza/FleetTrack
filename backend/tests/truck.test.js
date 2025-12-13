import request from 'supertest';
import app from '../app.js';
import Truck from '../models/Truck.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

describe('Truck Tests', () => {
    let adminToken;
    let chauffeurToken;
    
    beforeEach(async () => {
        await Truck.deleteMany({});
        await User.deleteMany({});
        
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const admin = await User.create({
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin'
        });
        
        const chauffeur = await User.create({
            firstname: 'Driver',
            lastname: 'User',
            email: 'driver@test.com',
            password: hashedPassword,
            role: 'chauffeur'
        });
        
        const adminLogin = await request(app)
            .post('/api/login')
            .send({
                email: 'admin@test.com',
                password: 'password123'
            });
        
        const chauffeurLogin = await request(app)
            .post('/api/login')
            .send({
                email: 'driver@test.com',
                password: 'password123'
            });
        
        adminToken = adminLogin.body.token;
        chauffeurToken = chauffeurLogin.body.token;
    });
    
    describe('POST /api/trucks', () => {
        
        it('should create a truck when user is admin', async () => {
            const res = await request(app)
                .post('/api/trucks')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    plateNumber: 'ABC123',
                    brand: 'Mercedes',
                    model: 'Actros',
                    year: 2020
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.plateNumber).toBe('ABC123');
            expect(res.body.brand).toBe('Mercedes');
        });
        
        it('should not create truck when user is chauffeur', async () => {
            const res = await request(app)
                .post('/api/trucks')
                .set('Authorization', `Bearer ${chauffeurToken}`)
                .send({
                    plateNumber: 'ABC123',
                    brand: 'Mercedes',
                    model: 'Actros',
                    year: 2020
                });
            
            expect(res.statusCode).toBe(403);
        });
        
        it('should not create truck with duplicate plate number', async () => {
            await Truck.create({
                plateNumber: 'ABC123',
                brand: 'Mercedes',
                model: 'Actros',
                year: 2020
            });
            
            const res = await request(app)
                .post('/api/trucks')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    plateNumber: 'ABC123',
                    brand: 'Volvo',
                    model: 'FH',
                    year: 2021
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Plate number already exists');
        });
        
        it('should not create truck without token', async () => {
            const res = await request(app)
                .post('/api/trucks')
                .send({
                    plateNumber: 'ABC123',
                    brand: 'Mercedes',
                    model: 'Actros',
                    year: 2020
                });
            
            expect(res.statusCode).toBe(401);
        });
    });
    
    describe('GET /api/trucks', () => {
        
        it('should get all trucks', async () => {
            await Truck.create([
                { plateNumber: 'ABC123', brand: 'Mercedes', model: 'Actros', year: 2020 },
                { plateNumber: 'XYZ789', brand: 'Volvo', model: 'FH', year: 2021 }
            ]);
            
            const res = await request(app)
                .get('/api/trucks')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });
        
        it('should return empty array when no trucks exist', async () => {
            const res = await request(app)
                .get('/api/trucks')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });
    
    describe('GET /api/trucks/:id', () => {
        
        it('should get truck by id', async () => {
            const truck = await Truck.create({
                plateNumber: 'ABC123',
                brand: 'Mercedes',
                model: 'Actros',
                year: 2020
            });
            
            const res = await request(app)
                .get(`/api/trucks/${truck._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.plateNumber).toBe('ABC123');
        });
        
        it('should return 404 for non-existent truck', async () => {
            const res = await request(app)
                .get('/api/trucks/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(404);
        });
    });
    
    describe('PUT /api/trucks/:id', () => {
        
        it('should update truck when user is admin', async () => {
            const truck = await Truck.create({
                plateNumber: 'ABC123',
                brand: 'Mercedes',
                model: 'Actros',
                year: 2020
            });
            
            const res = await request(app)
                .put(`/api/trucks/${truck._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    mileage: 50000,
                    status: 'in-use'
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.mileage).toBe(50000);
            expect(res.body.status).toBe('in-use');
        });
        
        it('should not update truck when user is chauffeur', async () => {
            const truck = await Truck.create({
                plateNumber: 'ABC123',
                brand: 'Mercedes',
                model: 'Actros',
                year: 2020
            });
            
            const res = await request(app)
                .put(`/api/trucks/${truck._id}`)
                .set('Authorization', `Bearer ${chauffeurToken}`)
                .send({
                    mileage: 50000
                });
            
            expect(res.statusCode).toBe(403);
        });
    });
    
    describe('DELETE /api/trucks/:id', () => {
        
        it('should delete truck when user is admin', async () => {
            const truck = await Truck.create({
                plateNumber: 'ABC123',
                brand: 'Mercedes',
                model: 'Actros',
                year: 2020
            });
            
            const res = await request(app)
                .delete(`/api/trucks/${truck._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Truck deleted successfully');
        });
        
        it('should not delete truck when user is chauffeur', async () => {
            const truck = await Truck.create({
                plateNumber: 'ABC123',
                brand: 'Mercedes',
                model: 'Actros',
                year: 2020
            });
            
            const res = await request(app)
                .delete(`/api/trucks/${truck._id}`)
                .set('Authorization', `Bearer ${chauffeurToken}`);
            
            expect(res.statusCode).toBe(403);
        });
    });
});