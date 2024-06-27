import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import StoryCard from '../components/StoryCard';
import { useNavigate, Link } from 'react-router-dom';
import SideBar from '../components/SideBar';
function ImportAnnotation() {

  const [msg, setMsg] = useState(null);
  const [isSuccessful,setIsSuccessful] = useState(false);
  const [index, setIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [storyData, setStoryData] = useState('');
  const [title, setTitle] = useState('');

  const navigate = useNavigate();

  const handleFile = (file) =>{
    if (file){
      setFile(file);
      console.log("Successful!");
    } else {
      setFile(null);
    }
        
  }

  const handleSubmit = () =>{
    if (!file){
      setMsg("No File found")
    } else {
      const formData = new FormData();
      formData.append('file', file);
        
      axios.post("/api/upload", formData ,{headers:{'Content-Type': 'multipart/form-data'}}).then(res =>{
        if (res.status === 200){
          setStoryData(res.data);
          setIsSuccessful(true);
        }
      });
          
    }
  }
  const handleDBUpload = () =>{

    const data = {
      title: title,
      storyData: storyData
    }
    axios.post("/api/DBupload", data).then(res => {
      if (res.status === 200){
        navigate(0);
        navigate(`/AnnotatingPage/${decodeURIComponent(title)}`);
      }
    });
  }

  const handleNext = () => {
    if (index < storyData.length - 1) {
      setIndex(index + 1);
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

      

  return (
    <div className='flex'>
      <SideBar />

      {isSuccessful ? (
        <div className='flex bg-darkSurface-100 min-h-screen w-[100%] gap-3 items-center justify-center flex-col'>
            <div className="flex gap-3 ">
              <h1 className=' text-offWhite text-2xl'>Title:</h1>
              <input type='text' placeholder='Enter a title for this dataset' className='p-2 rounded-2xl w-[300px] bg-darkSurface-300 text-offWhite' onChange={(e)=>{setTitle(e.target.value)}} />
            </div>
            
            <div className="flex flex-col ">
              <StoryCard 
                Instruction={storyData[index].instruction}
                Story={storyData[index].input}
                Output={storyData[index].output}
                CurrentIndex={index}
                TotalIndex={storyData.length}
              />
            </div>
            <div className="flex mt-3 gap-5">
              <button className="button" onClick={handlePrevious} disabled={index === 0}>Previous</button>
              <button className="button" onClick={handleNext} disabled={index === storyData.length - 1}>Next</button>
              <button className={`button`} onClick={() => { handleDBUpload() }}>Import</button>
            </div>
            
            {msg && <p className='text-red-500'>{msg}</p>}
        
        </div>
      ) : (
        <div className='flex bg-darkSurface-100 min-h-screen w-[100%] justify-center items-center flex-col gap-5'>
            <h1 className=' text-offWhite text-5xl '>Select file to import</h1>
            <input
                type="file"
                className="p-5 file:bg-primary-400 file:rounded-full file:border-0 file:px-4 file:py-2 file:cursor-pointer text-offWhite"
                accept="application/json"
                onChange={(e) => { handleFile(e.target.files[0]) }}
                placeholder='Enter JSON file!'
            />            
            {msg && <p className='text-red-500'>{msg}</p>}
            <button className={` button`} onClick={() => { handleSubmit() }}>Import</button>
        </div>
      )

      }
      
        
    </div>
  )
}

export default ImportAnnotation