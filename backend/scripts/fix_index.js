const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trend-analyzer';

async function fixIndex() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('users');

        // List indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        // Drop the problematic index if it exists
        const indexName = 'auth0Id_1';
        const indexExists = indexes.some(idx => idx.name === indexName);

        if (indexExists) {
            await collection.dropIndex(indexName);
            console.log(`Dropped index: ${indexName}`);
        } else {
            console.log(`Index ${indexName} not found.`);
        }

        // Also check for email index just in case, though that should be unique
        // ...

    } catch (error) {
        console.error('Error fixing index:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

fixIndex();
