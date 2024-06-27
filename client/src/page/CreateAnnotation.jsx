import React from 'react'
import { useEffect, useState } from 'react';
import StoryCard from '../components/StoryCard';
import { useNavigate, Link } from 'react-router-dom';
import SideBar from '../components/SideBar';

function CreateAnnotation(){
  return (
    <div className='flex bg-darkSurface-100 min-h-screen w-[100%] gap-3 items-center justify-center flex-col'>
    <div className="flex gap-3 ">
      <h1 className=' text-offWhite text-2xl'>Title:</h1>
      <input type='text' placeholder='Enter a title for this dataset' className='p-2 rounded-2xl w-[300px] bg-darkSurface-300 text-offWhite' onChange={(e)=>{setTitle(e.target.value)}} />
    </div>
    
    <div className="flex flex-col ">
      <div className='bg-darkSurface-300 w-[800px] min-h-[300px] flex rounded-2xl flex-col gap-5 p-10 text-offWhite flex-grow'>
        <div className="card">
          <h1 className='text-xl hover:bg-darkSurface-300'>Instruction:</h1>
          <p className='card-data'></p>
        </div>
        <div className='card'>
          <h1 className='text-xl'>Story:</h1>
          <p className='h-[100px] overflow-auto'></p>
        </div>
        <div className='card'>
          <h1 className='text-xl'>Output: </h1>
          <textarea 
            className='h-[100px] overflow-auto p-2 rounded-2xl w-[500px] bg-darkSurface-100 text-offWhite' 
            
          ></textarea>
        </div>
        <div>
          <p>Historial Reference:</p>
          <h1></h1>
        </div>
        
        <div className='flex items-center justify-center text-2xl'>
          
        </div>
      </div>
    </div>
   

</div>
  )
}

export default CreateAnnotation