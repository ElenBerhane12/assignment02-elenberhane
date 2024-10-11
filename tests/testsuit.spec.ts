// testsuit.spec.ts
import { test, expect } from '@playwright/test';
import { APIHelper } from './apiHelper';
import { generateRandomClientsPlayloud } from './testData';



test.describe('Test Suite 01', () => {
    let apiHelper: APIHelper;
    const BASE_URL = process.env.BASE_URL! 

    // Before all tests, perform login
    test.beforeAll(async ({ request }) => {
        apiHelper = new APIHelper(BASE_URL, process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);


        const loginResponse = await apiHelper.performLogin(request);
        expect(loginResponse.ok()).toBeTruthy();

        const loginData = await loginResponse.json();
        expect(loginData).toHaveProperty('username', process.env.TEST_USERNAME);
        expect(loginData).toHaveProperty('token');
    });

    // Test Case 01: Log in
    test('Test Case 01: Log in', async ({ request }) => {
        const loginResponse = await apiHelper.performLogin(request);
        const loginData = await loginResponse.json();

        expect(loginResponse.ok()).toBeTruthy();
        expect(loginData).toMatchObject({
            username: process.env.TEST_USERNAME,
            token: expect.any(String),
        });
    });

    // Test Case 02: Get All Clients
    test('Test Case 02: Get All Clients', async ({ request }) => {
        const clients = await apiHelper.getClients(request);

        expect(clients).toBeInstanceOf(Array);
        expect(clients.length).toBeGreaterThanOrEqual(2);

        clients.forEach(client => {
            expect(client).toHaveProperty('id');
            expect(client).toHaveProperty('created');
            expect(client).toHaveProperty('name');
            expect(client).toHaveProperty('email');
            expect(client).toHaveProperty('telephone');
        });});

    // Test Case 03: Create a new client
    test('Test Case 03: Create a new client', async ({ request }) => {
        const clientData = generateRandomClientsPlayloud();

        const response = await apiHelper.createClient(request, clientData);
        expect(response).toMatchObject({
            name: clientData.name,
            email: clientData.email,
            telephone: clientData.telephone,
            id: expect.any(Number),
            created: expect.any(String),
        });
    });

    // Test Case 04: Delete a client
    test('Test Case 04: Delete a client', async ({ request }) => {
        const clientIdToDelete = 3; // Change this to a valid client ID
        const response = await apiHelper.deleteClient(request, clientIdToDelete);
        expect(response.ok).toBe(true);
    });

    // Test Case 05: Fetch Client by ID
    test('Test Case 05: Fetch client with ID 1', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/client/1`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: process.env.TEST_USERNAME,
                    token: apiHelper.token,
                }),
            },
        });
        expect(response.ok()).toBeTruthy();
        const client = await response.json();
        expect(client).toMatchObject({
            id: 1,
            name: expect.any(String),
            email: expect.any(String),
            telephone: expect.any(String),
        });
    });

    // Test Case 06: Attempt to delete a client without authorization
    test('Test Case 06: Delete Client Without Authorization', async ({ request }) => {
        const clientId = 5; 

        const deleteResponse = await request.delete(`${BASE_URL}/api/client/${clientId}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: "invalidUser",
                    token: "invalidToken123456", 
                }),
            },
        });

        
        expect(deleteResponse.status()).toBe(401); 
        const responseText = await deleteResponse.text();
       
        
        expect(responseText).toContain("Unauthorized");
    });
    
});

