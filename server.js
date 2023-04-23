require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const scheduler = require("node-cron");
const { fetchAndDeleteData } = require("./services/fileCleaner");

const connectDB = require('./config/db');
connectDB();

//cleaning all the older files
scheduler.schedule("00 12 * * *", () => fetchAndDeleteData());

// middleware
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes 
app.get('/', (req, res)=>{
    res.redirect("/api/files");
})

app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

// listening on port
app.listen(PORT, console.log(`Listening on port ${PORT}.`));