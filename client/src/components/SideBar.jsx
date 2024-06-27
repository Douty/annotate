import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const [dataset, setDataset] = useState(null);

  useEffect(() => {
    const handleDataSetLoad = async () => {
      const res= await axios.get("/api/LoadDataset");
      setDataset(res.data);
    };

    handleDataSetLoad();
  }, []);
  
  if (!dataset){
    return (
    
      <div className='flex flex-col bg-darkSurface-200 w-[300px] min-h-screen p-5 text-xl text-offWhite'>
        <Link to="/">Home</Link>
        <Link to="/ImportAnnotation">Import</Link>
        <div className="border-t border-offWhite mt-5"></div>
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    
    <div className='flex flex-col bg-darkSurface-200 w-[300px] min-h-screen p-5 text-xl text-offWhite'>
      <Link to="/">Home</Link>
      <Link to="/ImportAnnotation">Import</Link>
      <div className="border-t border-offWhite mt-5"></div>
      {dataset.map((item, index) => (
        <Link 
          key={index} 
          to={`/AnnotatingPage/${encodeURIComponent(item.title)}`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
