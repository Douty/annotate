import papa from 'papaparse';
import JSONStream from 'JSONStream';
import fs from 'fs';


class fileConverter {


    static readJson(jsonData) {
       return JSON.parse(jsonData);
    }
    // static createJson = (storyData, prompt, answers) => {
    //     const result = [];
    //     for (let i = 0; i < storyData.length; i++) {
    //         let formatter = {
    //             instruction: prompt,
    //             input: JSON.stringify(storyData[i]),
    //             output: JSON.stringify(answers[i] ? answers[i] : {})
    //         };
    //         result.push(formatter);
    //     }
    
    //     return result;
    // };
    
    // static jsonToCsv = (storyData, prompt, answers) => {
    //     const jsonData = createJson(storyData, prompt, answers);
    //     const csvData = papa.unparse(jsonData);
    //     return csvData;
    // };
    
    // static csvParse = (input) => {
    //     papa.parse(input, {
    //         download: false,
    //         header: true,
    //         skipEmptyLines: true,
    //         complete: (result) => {
    //             for (let i = 0; i < result.data.length; i++) {
    //                 console.log(result.data[i].Story);
    //             }
    //             console.log("File uploaded successfully!");
    //         }
    //     });
    // };
}
export default fileConverter;
 