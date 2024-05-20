import express from 'express';
import cors from 'cors';
import multer from 'multer';
import papa from 'papaparse';
import bodyParser from 'body-parser';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let storyData = [];
let prompt = "";
let answers = [];
let fileBuffer = null; 

const createJson = (storyData, prompt, answers) => {
    const result = [];
    for (let i = 0; i < storyData.length; i++) {
        let formatter = {
            instruction: prompt,
            input: storyData[i],
            output: answers[i] ? answers[i] : {}
        };
        result.push(formatter);
    }

    return result;
};

const jsonToCsv = (storyData, prompt, answers) => {
    const jsonData = createJson(storyData, prompt, answers);
    const csvData = papa.unparse(jsonData);
    return csvData;
};

const csvParse = (input) => {
    papa.parse(input, {
        download: false,
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
            for (let i = 0; i < result.data.length; i++) {
                storyData.push(result.data[i].Story);
            }
            console.log("File uploaded successfully!");
        }
    });
};

app.post('/api/annotate', (req, res) => {
    answers = req.body.answers;
    prompt = req.body.prompt;
    const csvData = jsonToCsv(storyData, prompt, answers);
    fileBuffer = Buffer.from(csvData, 'utf8');
    console.log("File buffer created:", fileBuffer)
    res.status(200).send("Data processed and CSV created");
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    fileBuffer = req.file.buffer;
    csvParse(req.file.buffer.toString('utf8'));
    res.status(200).send("File uploaded and parsed successfully");
});

app.get('/api/download', (req, res) => {
    if (fileBuffer) {
        res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
        res.send(fileBuffer);
    } else {
        res.status(404).send("No file available for download");
    }
});

app.get('/api/storydata', (req, res) => {
    res.send(storyData);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
