import request from 'supertest';
import app from '../app.js';
import Tire from '../models/Tire.js';
import Truck from '../models/Truck.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

describe('Tire Tests', () => {
    let adminToken;
    let truckId;
    
    beforeEach(async () => {
        await Tire.deleteMany({});
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
            year: 2020
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
    
    describe('POST /api/tires', () => {
        
        it('should create a tire', async () => {
            const res = await request(app)
                .post('/api/tires')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    truck: truckId,
                    position: 'Front Left',
                    brand: 'Michelin',
                    installationDate: new Date(),
                    mileageAtInstallation: 5000
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.position).toBe('Front Left');
            expect(res.body.brand).toBe('Michelin');
        });
    });
    
    describe('GET /api/tires/truck/:truckId', () => {
        
        it('should get all tires for a truck', async () => {
            await Tire.create([
                {
                    truck: truckId,
                    position: 'Front Left',
                    brand: 'Michelin',
                    installationDate: new Date(),
                    mileageAtInstallation: 5000
                },
                {
                    truck: truckId,
                    position: 'Front Right',
                    brand: 'Michelin',
                    installationDate: new Date(),
                    mileageAtInstallation: 5000
                }
            ]);
            
            const res = await request(app)
                .get(`/api/tires/truck/${truckId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });
    
    describe('PUT /api/tires/:id', () => {
        
        it('should update tire status', async () => {
            const tire = await Tire.create({
                truck: truckId,
                position: 'Front Left',
                brand: 'Michelin',
                installationDate: new Date(),
                mileageAtInstallation: 5000
            });
            
            const res = await request(app)
                .put(`/api/tires/${tire._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    status: 'worn'
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('worn');
        });
    });
    
    describe('DELETE /api/tires/:id', () => {
        
        it('should delete tire', async () => {
            const tire = await Tire.create({
                truck: truckId,
                position: 'Front Left',
                brand: 'Michelin',
                installationDate: new Date(),
                mileageAtInstallation: 5000
            });
            
            const res = await request(app)
                .delete(`/api/tires/${tire._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
        });
    });
});