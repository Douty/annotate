import React, { useState, useEffect } from 'react';

const InputCard = ({ Instruction, Story, Output, onOutputChange, HistorialRef, CurrentIndex, TotalIndex }) => {
  const [localOutput, setLocalOutput] = useState(Output);

  useEffect(() => {
    setLocalOutput(Output);
  }, [Output]);

  const handleChange = (e) => {
    setLocalOutput(e.target.value);
    onOutputChange(e.target.value);
  };

  return (
    <div className='bg-darkSurface-300 w-[800px] min-h-[300px] flex rounded-2xl flex-col gap-5 p-10 text-offWhite flex-grow'>
      <div className="card">
        <h1 className='text-xl hover:bg-darkSurface-300'>Instruction:</h1>
        <p className='card-data'>{Instruction}</p>
      </div>
      <div className='card'>
        <h1 className='text-xl'>Story:</h1>
        <p className='h-[100px] overflow-auto'>{Story}</p>
      </div>
      <div className='card'>
        <h1 className='text-xl'>Output: </h1>
        <textarea 
          className='h-[100px] overflow-auto p-2 rounded-2xl w-[500px] bg-darkSurface-100 text-offWhite' 
          value={localOutput}
          onChange={handleChange}
          placeholder={Output}
        ></textarea>
      </div>
      <div>
        <p>Historial Reference:</p>
        <h1>{HistorialRef}</h1>
      </div>
      
      <div className='flex items-center justify-center text-2xl'>
        <h1>{CurrentIndex}/{TotalIndex}</h1>
      </div>
    </div>
  );
}

export default InputCard;
