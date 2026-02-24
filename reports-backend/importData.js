const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const IQNorm = require('./models/tqNorms');

const importData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');

        const jsonPath = path.join(__dirname, '..', 'Reports.iqnorms.json');
        if (!fs.existsSync(jsonPath)) {
            console.error('Reports.iqnorms.json not found at', jsonPath);
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`Found ${data.length} records to import.`);

        // Clear existing data (optional, but good for a fresh start)
        await IQNorm.deleteMany({});
        console.log('Cleared existing data.');

        // Insert new data
        await IQNorm.insertMany(data);
        console.log('Successfully imported all records.');

        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (err) {
        console.error('Import error:', err);
        process.exit(1);
    }
};

importData();
