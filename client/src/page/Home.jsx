import { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import InputCard from '../components/InputCard';
import SideBar from '../components/SideBar';
function Home() {
  const [isImporting, setIsImporting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dataset, setDataset] = useState([]);
  const [msg, setMsg] = useState(null);
  const [username, setUsername] = useState('Person 1');
 
  const navigate = useNavigate();


  
  const handleSubmit = () =>{
    if (isImporting){
      navigate("/ImportAnnotation");
    } else if (isCreating){
      navigate("/CreateAnnotation");
    }
  }
 

  return (
    <div className='flex'>
      <SideBar />
    
      <div className='flex bg-darkSurface-100 min-h-screen w-[100%] justify-center items-center flex-col gap-10'>
        <div className='flex m-5 gap-3'  >
          <label className='text-offWhite text-xl '>Username: </label>
          <input type="text" placeholder='Bob' className='p-2 rounded-2xl w-[300px] bg-darkSurface-300 text-offWhite' onChange={(e)=>{setUsername(e.target.value)}}/>
          <button className='button-input'>set username</button>
        </div>
        <h1 className='mb-10 text-offWhite text-5xl w-[50%]'>Hi there, to start annotating import an existing dataset or create a new one!</h1>
        
        {msg && <p className='text-red-500'>{msg}</p>}
        <div className='flex justify-center items-center gap-32 text-2xl'>
          <button className='button' onClick={()=>{setIsImporting(true), handleSubmit()}}>Import</button>
          <button className='button' onClick={()=>{setIsCreating(true),handleSubmit()}}>Create new</button>  
        </div>
      </div>
        
    </div>
  );
};

export default Home
