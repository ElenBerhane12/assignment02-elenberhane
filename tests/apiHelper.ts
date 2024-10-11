import { APIRequestContext } from '@playwright/test';

export class APIHelper {
    private BASE_URL: string;
    private TEST_USERNAME: string;
    private TEST_PASSWORD: string;
    public token: string | undefined; 

    constructor(baseUrl: string, username: string, password: string) {
        this.BASE_URL = baseUrl;
        this.TEST_USERNAME = username;
        this.TEST_PASSWORD = password;
    }

    // Perform login
    async performLogin(request: APIRequestContext) {
        const response = await request.post(`${this.BASE_URL}/api/login`, {
            data: {
                username: this.TEST_USERNAME,
                password: this.TEST_PASSWORD,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();
        this.token = responseData.token; 

        return response; 
    }
}