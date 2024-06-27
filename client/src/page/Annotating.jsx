import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Annotating() {
  const [prompt, setPrompt] = useState("Hi");
  const [submission, setSubmission] = useState(false);
  const [storydata, setStoryData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const navigate = useNavigate();

  const getStories = async () => {
    try {
      const res = await axios.get("/api/storydata");
      setStoryData(res.data);
      setAnswers(res.data.map(() => ({ relevance: '', location: '', title: '', actors: '' })));
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  }
  useEffect(()=>{
    getStories();
  },[])

  const handleNextIndex = () => {
    if (currentIndex < answers.length - 1){
      setCurrentIndex(currentIndex + 1);
    }
  }
  const handlePreviousIndex = () => {
    if (currentIndex > 0){
      setCurrentIndex(currentIndex - 1);
    }
  }
  const handlePromptText = (e) =>{
    setPrompt(e.target.value);
  }

  const handleInputChange = (e, field) => {
    const newAnswers = [...answers];
    if (currentIndex >= 0 && currentIndex < newAnswers.length) {
      newAnswers[currentIndex][field] = e.target.value;
      setAnswers(newAnswers);
    }
  }

  const handleSubmit = async() =>{
    await axios.post('/api/annotate', {answers: answers, prompt: prompt}).then(res =>{
      if (res.status === 200){
        navigate("/Download");
      }
    });
  }

  if (submission && prompt) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-blacksteel'>
        <div className="bg-floralwhite w-[1000px] h-[800px] rounded-2xl"> 
          <div className="flex flex-col items-center justify-center gap-5">
            <div className=' h-[300px] overflow-auto  bg-gray-200 rounded-md'>
              <h1 className="w-[600px] mt-14 text-3xl">{storydata[currentIndex]}</h1>
            </div>
            <div className='flex flex-col text-wrap '>
              
                <label className="text-xl">Relevance: </label>
              
                <textarea
                  className='rounded-md h-[50px]' 
                  type="text" 
                  value={answers[currentIndex]?.relevance || ''}
                  onChange={(e) => handleInputChange(e, 'relevance')}
                />
                <label className="text-xl">Location: </label>
                <textarea  
                  className='rounded-md h-[50px]' 
                  type="text" 
                  value={answers[currentIndex]?.location || ''}
                  onChange={(e) => handleInputChange(e, 'location')}
                />

                <label className="text-xl">Title: </label>
                <textarea 
                  className='rounded-md h-[50px]' 
                  type="text" 
                  value={answers[currentIndex]?.title || ''}
                  onChange={(e) => handleInputChange(e, 'title')}
                />
                <label className="text-xl">Actor: </label>
                <textarea 
                  className='rounded-md h-[50px] w-[300px]' 
                  type="text" 
                  value={answers[currentIndex]?.actors || ''}
                  onChange={(e) => handleInputChange(e, 'actors')}
                />
              
            </div>
            <div className='flex gap-3'>
              <button className='button-style' onClick={handlePreviousIndex}>Previous</button>
              <button className='button-style' onClick={handleNextIndex}>Next</button>
              <button className={`button-style ${currentIndex === answers.length - 1 ? 'show' : 'hidden'}`} onClick={handleSubmit}>Complete</button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen bg-blacksteel'>
        <div className="bg-floralwhite w-[1000px] h-[800px] rounded-2xl"> 
          <div className="flex flex-col justify-center items-center h-[800px] gap-5">
            <h1 className="text-2xl">Enter in the prompt you will be using</h1>
            <textarea 
              className="p-2 w-[400px] bg-gray-5 resize-none border-2" 
              type="text" 
              onChange={handlePromptText} 
            />
            <button 
              className='button-style' 
              onClick={() => { 
                setSubmission(true); 
                
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Annotating;
