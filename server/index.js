import express from 'express';
import cors from 'cors';
import multer from 'multer';
import papa from 'papaparse';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import { Server } from 'socket.io';
import { MongoClient, ObjectId } from "mongodb";

import fileConverter from "./fileConverter.js";

dotenv.config();
const client = new MongoClient(process.env.KEY, { useNewUrlParser: true, useUnifiedTopology: true });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    client.connect()
        .then(() => console.log("Database is up and running"))
        .catch(err => console.error("Database connection error:", err));
});

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

const db = client.db("db-annotation");
const datasetDB = db.collection("storydata");

let fileBuffer = null; 
let jsondata = null;



io.on('connection', (socket) => {
  const { title } = socket.handshake.query;
  
  if (title) {
    socket.join(title);
    let changes = {
        output: [],
        historialRef: []
    }
    console.log(`A user connected to room: ${title}`);
    io.to(title).emit("recentChange",changes);

    socket.on('disconnect', () => {
      console.log(`A user disconnected from room: ${title}`);
    });
    socket.on('outputChange', (data) => {
      console.log(`Input update from ${title}: ${data.value}`);
      changes.output[data.index] = data.value;
      io.to(title).emit('inputChange', data);
    });
    socket.on('outputHistorical', (data) => {
        console.log(`Input update from ${title}: ${data.value}`);
        changes.historialRef[data.index] = data.value;
        io.to(title).emit('inputHistorical', data);
      });

  } else {
    console.error('No room specified in handshake query');
  }
  

});

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        fileBuffer = req.file.buffer;
        jsondata = fileConverter.readJson(req.file.buffer.toString('utf8'));
        res.status(200).send(jsondata);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send("Error uploading and parsing file");
    }
});

app.post("/api/DBupload", async (req, res) => {
    try {
        let dataSet = req.body;
        console.log(dataSet);
        await datasetDB.insertOne(dataSet);
        console.log("Complete!");
        res.status(200).send("Dataset uploaded successfully");
    } catch (error) {
        console.error('Error uploading dataset:', error);
        res.status(500).send("Error uploading dataset");
    }
});

app.get("/api/LoadDataset", async (req, res) => {
    try {
        let dataset = await datasetDB.find().toArray();
        res.status(200).send(dataset);
    } catch (error) {
        console.error('Error loading dataset:', error);
        res.status(500).send("Error loading dataset");
    }
});

app.get('/api/GetDataByTitle', async (req, res) => {
    const title = req.query.title;

    try {
        const dataset = await datasetDB.findOne({ title: decodeURIComponent(title) });

        if (dataset) {
            res.json(dataset);
        } else {
            res.status(404).json({ message: 'Dataset not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/UpdateDataByTitle', async (req, res) => {
    const { title, storyData } = req.body;

    try {
        const updatedDataset = await datasetDB.findOneAndUpdate(
            { title: decodeURIComponent(title) },
            { $set: { storyData } },
            { returnOriginal: false }
        );

        if (updatedDataset.value) {
            res.json(updatedDataset.value);
        } else {
            res.status(404).json({ message: 'Dataset not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/annotate', (req, res) => {
    const { answers, prompt } = req.body;
    const csvData = jsonToCsv(storyData, prompt, answers);
    fileBuffer = Buffer.from(csvData, 'utf8');
    console.log("File buffer created:", fileBuffer);
    res.status(200).send("Data processed and CSV created");
});

app.get('/api/export', async (req, res) => {
    const title = req.query.title;

    try {
        const dataset = await datasetDB.findOne({ title: decodeURIComponent(title) });
        if (dataset) {
            const content = JSON.stringify(dataset, null, 2);
            res.setHeader('Content-Disposition', 'attachment; filename=document.json');
            res.setHeader('Content-Type', 'application/json');
            res.send(content);
        } else {
            res.status(404).send("No file available for download");
        }
    } catch (error) {
        res.status(500).send("Error exporting file");
    }
});
