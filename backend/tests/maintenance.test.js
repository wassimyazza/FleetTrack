import request from 'supertest';
import app from '../app.js';
import Maintenance from '../models/Maintenance.js';
import Truck from '../models/Truck.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

describe('Maintenance Tests', () => {
    let adminToken;
    let truckId;
    
    beforeEach(async () => {
        await Maintenance.deleteMany({});
        await Truck.deleteMany({});
        await User.deleteMany({});
        
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await User.create({
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin'
        });
        
        const truck = await Truck.create({
            plateNumber: 'ABC123',
            brand: 'Mercedes',
            model: 'Actros',
            year: 2020,
            mileage: 50000
        });
        
        truckId = truck._id;
        
        const adminLogin = await request(app)
            .post('/api/login')
            .send({
                email: 'admin@test.com',
                password: 'password123'
            });
        
        adminToken = adminLogin.body.token;
    });
    
    describe('POST /api/maintenances', () => {
        
        it('should create maintenance record', async () => {
            const res = await request(app)
                .post('/api/maintenances')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    truck: truckId,
                    type: 'oil-change',
                    description: 'Regular oil change',
                    date: new Date(),
                    cost: 500,
                    mileage: 50000,
                    nextMaintenanceAt: 60000
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.type).toBe('oil-change');
            expect(res.body.cost).toBe(500);
        });
        
        it('should update truck status to maintenance', async () => {
            await request(app)
                .post('/api/maintenances')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    truck: truckId,
                    type: 'revision',
                    description: 'Annual revision',
                    date: new Date(),
                    cost: 1500,
                    mileage: 50000
                });
            
            const truck = await Truck.findById(truckId);
            expect(truck.status).toBe('maintenance');
        });
    });
    
    describe('GET /api/maintenances/truck/:truckId', () => {
        
        it('should get all maintenances for a truck', async () => {
            await Maintenance.create([
                {
                    truck: truckId,
                    type: 'oil-change',
                    description: 'Oil change',
                    date: new Date(),
                    cost: 500,
                    mileage: 40000
                },
                {
                    truck: truckId,
                    type: 'tire-change',
                    description: 'Tire replacement',
                    date: new Date(),
                    cost: 2000,
                    mileage: 45000
                }
            ]);
            
            const res = await request(app)
                .get(`/api/maintenances/truck/${truckId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });
    
    describe('GET /api/maintenances/upcoming', () => {
        
        it('should get upcoming maintenances', async () => {
            await Maintenance.create({
                truck: truckId,
                type: 'oil-change',
                description: 'Oil change',
                date: new Date(),
                cost: 500,
                mileage: 45000,
                nextMaintenanceAt: 55000
            });
            
            const res = await request(app)
                .get('/api/maintenances/upcoming')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
    
    describe('DELETE /api/maintenances/:id', () => {
        
        it('should delete maintenance record', async () => {
            const maintenance = await Maintenance.create({
                truck: truckId,
                type: 'oil-change',
                description: 'Oil change',
                date: new Date(),
                cost: 500,
                mileage: 50000
            });
            
            const res = await request(app)
                .delete(`/api/maintenances/${maintenance._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
        });
    });
});
