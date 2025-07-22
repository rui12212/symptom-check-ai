const express = require('express')
const cors = require('cors');
const authRoutes = require('./routes/auth')
const diagnoseRoutes = require('./routes/diagnose')
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/diagnose', diagnoseRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT,()=> {
    console.log('Server running on http://localhost:8000');
});

app.use('/api/diagnoses', diagnoseRoutes);