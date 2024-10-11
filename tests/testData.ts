import { faker } from '@faker-js/faker';

// Function to generate random client data
export const generateRandomClientsPlayloud = () => {
    return {
        name: faker.name.fullName(), 
        email: faker.internet.email(), 
        telephone: faker.phone.number(), 
    };
};

// Function to generate data for editing a client
export const generateEditClientsPlayloud = () => {
    return {
        name: faker.name.fullName(), 
        email: faker.internet.email(), 
        telephone: faker.phone.number(), 
    };
};

// Function to generate data for deleting a client
export const generateDeleteClientsPlayloud = () => {
    return {
        name: faker.name.fullName(), 
        email: faker.internet.email(), 
        telephone: faker.phone.number(), 
    };
};
