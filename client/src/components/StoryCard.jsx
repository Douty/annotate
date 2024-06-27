import React from 'react'

const StoryCard = ({Instruction, Story, Output, CurrentIndex, TotalIndex}) => {
  return (
    <div className='bg-darkSurface-300 w-[800px] min-h-[300px] flex rounded-2xl flex-col gap-5 p-10 text-offWhite flex-grow'>
        <div className="card">
            <h1 className='text-xl hover:bg-darkSurface-300'>Instruction:</h1>
            <p className='h-[250px] overflow-auto'>{Instruction}</p>
        </div>
        <div className='card'>
            <h1 className='text-xl'>Story:</h1>
            <p className='h-[100px] overflow-auto'>{Story}</p>
        </div>
        <div className='card'>
            <h1 className='text-xl'>Output: </h1>
            <p className='h-[250px] overflow-auto'>{Output}</p>
        </div>
        <div className='flex items-center justify-center text-2xl'>
            <h1>{CurrentIndex}/{TotalIndex}</h1>
        </div>
        
    </div>
  )
}

export default StoryCard