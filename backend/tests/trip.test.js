import request from 'supertest';
import app from '../app.js';
import Trip from '../models/Trip.js';
import Truck from '../models/Truck.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

describe('Trip Tests', () => {
    let adminToken;
    let chauffeurToken;
    let truckId;
    let driverId;
    
    beforeEach(async () => {
        await Trip.deleteMany({});
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
        
        const driver = await User.create({
            firstname: 'Driver',
            lastname: 'User',
            email: 'driver@test.com',
            password: hashedPassword,
            role: 'chauffeur'
        });
        
        driverId = driver._id;
        
        const truck = await Truck.create({
            plateNumber: 'ABC123',
            brand: 'Mercedes',
            model: 'Actros',
            year: 2020
        });
        
        truckId = truck._id;
        
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
    
    describe('POST /api/trips', () => {
        
        it('should create a trip when user is admin', async () => {
            const res = await request(app)
                .post('/api/trips')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    driver: driverId,
                    truck: truckId,
                    departure: 'Casablanca',
                    destination: 'Rabat',
                    departureDate: new Date()
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.departure).toBe('Casablanca');
            expect(res.body.destination).toBe('Rabat');
        });
        
        it('should not create trip when user is chauffeur', async () => {
            const res = await request(app)
                .post('/api/trips')
                .set('Authorization', `Bearer ${chauffeurToken}`)
                .send({
                    driver: driverId,
                    truck: truckId,
                    departure: 'Casablanca',
                    destination: 'Rabat',
                    departureDate: new Date()
                });
            
            expect(res.statusCode).toBe(403);
        });
    });
    
    describe('GET /api/my-trips', () => {
        
        it('should get trips for logged in driver', async () => {
            await Trip.create({
                driver: driverId,
                truck: truckId,
                departure: 'Casablanca',
                destination: 'Rabat',
                departureDate: new Date()
            });
            
            const res = await request(app)
                .get('/api/my-trips')
                .set('Authorization', `Bearer ${chauffeurToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });
    
    describe('PATCH /api/trips/:id/status', () => {
        
        it('should update trip status', async () => {
            const trip = await Trip.create({
                driver: driverId,
                truck: truckId,
                departure: 'Casablanca',
                destination: 'Rabat',
                departureDate: new Date(),
                status: 'todo'
            });
            
            const res = await request(app)
                .patch(`/api/trips/${trip._id}/status`)
                .set('Authorization', `Bearer ${chauffeurToken}`)
                .send({
                    status: 'in-progress',
                    startMileage: 10000
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('in-progress');
            expect(res.body.startMileage).toBe(10000);
        });
        
        it('should update truck mileage when trip is completed', async () => {
            const trip = await Trip.create({
                driver: driverId,
                truck: truckId,
                departure: 'Casablanca',
                destination: 'Rabat',
                departureDate: new Date(),
                status: 'in-progress',
                startMileage: 10000
            });
            
            const res = await request(app)
                .patch(`/api/trips/${trip._id}/status`)
                .set('Authorization', `Bearer ${chauffeurToken}`)
                .send({
                    status: 'completed',
                    endMileage: 10250,
                    fuelUsed: 50
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('completed');
            
            const updatedTruck = await Truck.findById(truckId);
            expect(updatedTruck.mileage).toBe(250);
        });
    });
    
    describe('GET /api/trips/:id/pdf', () => {
        
        it('should download trip as PDF', async () => {
            const trip = await Trip.create({
                driver: driverId,
                truck: truckId,
                departure: 'Casablanca',
                destination: 'Rabat',
                departureDate: new Date()
            });
            
            const res = await request(app)
                .get(`/api/trips/${trip._id}/pdf`)
                .set('Authorization', `Bearer ${chauffeurToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/pdf');
        });
    });
    
    describe('DELETE /api/trips/:id', () => {
        
        it('should delete trip when user is admin', async () => {
            const trip = await Trip.create({
                driver: driverId,
                truck: truckId,
                departure: 'Casablanca',
                destination: 'Rabat',
                departureDate: new Date()
            });
            
            const res = await request(app)
                .delete(`/api/trips/${trip._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
        });
    });
});