import { useState } from 'react'
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
 
  const navigate = useNavigate();
  
  const handleSubmit = () =>{
    if (!file){
      setMsg("No File found")
    } else {
      const formData = new FormData();
      formData.append('file', file);
    
      axios.post("/api/upload", formData ,{headers:{'Content-Type': 'multipart/form-data'}}).then(res =>{
        if (res.status === 200){
            console.log(res.data);
            navigate("/annotating");
        }
      });
      
    }
  }
  const handleFile = (file) =>{

    if (file){
      setFile(file);
      console.log("Successful!");
    } else {
      setFile(null);
      
    }
    
  }
 
  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-blacksteel'>
      <div className='flex  flex-col text-center bg-floralwhite h-[500px] w-[500px] rounded-xl justify-center items-center gap-3'>
        <h1 className='text-4xl'>Dataset annotator</h1>
        <h1 className='text-xl'>Please provide a csv file to annotate!</h1>
        <h1 className=' '>{msg}</h1>
        <input  type="file" accept="text/csv" onChange={(e)=>{handleFile(e.target.files[0])}} placeholder='Enter CSV file!'/>
        <button className='bg-Eeire text-floralwhite p-4 w-[150px]' onClick={handleSubmit}>Upload</button>
        
      </div>
      
    </div>
  )
}

export default Home
