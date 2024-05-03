import express from "express";
import cors from "cors";
import multer from "multer";
import papa from "papaparse";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const app = express();
const port = 3000;

app.use(cors());

let storyData = [];

const csvParse = (input) =>{
    papa.parse(input,{
        download: false,
        header: true,
        skipEmptyLines: true,
        complete: (result) =>{
            for (let i = 0; i < result.data.length; i++){
                storyData.push(result.data[i].Story);
            }
            
        }
    })
   
}

app.post('/api/upload', upload.single('file'), (req, res) => {
    csvParse(req.file.buffer.toString('utf8'));
    res.status(200).send("Redirecting")
});


app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})