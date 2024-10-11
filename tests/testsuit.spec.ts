import { test, expect } from '@playwright/test';
import { APIHelper } from './apiHelper';

test.describe('Test Suite 01', () => {
    let apiHelper: APIHelper;
    const BASE_URL = process.env.BASE_URL!; 

    // Before all tests, perform login
    test.beforeAll(async ({ request }) => {
        apiHelper = new APIHelper(BASE_URL, process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
        console.log(process.env.TEST_PASSWORD); 

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
        });

        expect(clients[0]).toMatchObject({
            id: 1,
            created: "2020-01-05T12:00:00.000Z",
            name: "Jonas Hellman",
            email: "jonas.hellman@example.com",
            telephone: "070 000 0001",
        });

        expect(clients[1]).toMatchObject({
            id: 2,
            created: "2020-01-06T12:00:00.000Z",
            name: "Mikael Eriksson",
            email: "mikael.eriksson@example.com",
            telephone: "070 000 0002",
        });
    });

    // Test Case 03: Create a new client
    test('Test Case 03: Create a new client', async ({ request }) => {
        const clientData = {
            name: "Ellen Berhane",
            email: "ellen.berhane@example.com",
            telephone: "070 564 0001",
        };

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
        const clientIdToDelete = 5; 
        const response = await apiHelper.deleteClient(request, clientIdToDelete);
        expect(response.ok).toBe(true); 
    });
    // Test Case: Fetch Client by ID (id: 1)
    test('Fetch client with ID 1', async ({ request }) => {
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
            created: "2020-01-05T12:00:00.000Z",
            name: "Jonas Hellman",
            email: "jonas.hellman@example.com",
            telephone: "070 000 0001",
        });
    });
    // Test case: Attempt to delete a client without authorization
    test('Delete Client Without Authorization', async ({ request }) => {
        const clientId = 5; // Example client ID to delete

        // Perform the DELETE request with invalid credentials
        const deleteResponse = await request.delete(`${BASE_URL}/api/client/${clientId}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: "invalidUser",
                    token: "6683b8c1266c78612dbe99ed2367c647", // Example invalid token
                }),
            },
        });

        // Check if the response status is 401 Unauthorized
        expect(deleteResponse.status()).toBe(401); // Expect the status to be 401
        const responseText = await deleteResponse.text();

        // Optionally check the response message
        expect(responseText).toContain("Unauthorized");
    });
});
