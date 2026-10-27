require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
        console.log('Prisma connection established.');

        const count = await prisma.user.count();
        console.log('DATABASE CONNECTED. User count:', count);
    } catch (error) {
        console.error('DATABASE ERROR:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabase();
