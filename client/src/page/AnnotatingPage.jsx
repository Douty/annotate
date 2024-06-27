import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../components/SideBar';
import InputCard from '../components/InputCard';
import { io } from 'socket.io-client';

const AnnotatingPage = () => {
  const { title } = useParams();
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(null);
  const [newOutput, setNewOutput] = useState([]);
  const [historialRef, setHistorialRef] = useState([]);
  const [activeSelect, setActiveSelect] = useState(false);
  const [position, setPosition] = useState(null);
  const [socketConnection, setSocketConnection] = useState(null);

  useEffect(() => {
    const namespace = encodeURIComponent(title);
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/GetDataByTitle?title=${namespace}`);
        setData(res.data);
        setNewOutput(res.data.storyData.map(item => item.output || ""));
        setHistorialRef(res.data.storyData.map(item => item.historialRef || ""));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    const socket = io(`http://localhost:3000`, {
      query: { title: namespace }
    });

    setSocketConnection(socket);

    socket.on('connect', (data) => {
      console.log(`Connected to room: ${namespace}`);
      
      
      console.log('Data on connect:', data);
      
      
      if (data && data.historialRef && data.historialRef.length !== 0) {
        setHistorialRef(data.historialRef);
      }
      if (data && data.output && data.output.length !== 0) {
        setNewOutput(data.output);
      }
      
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected from room: ${namespace}`);
    });

    socket.on('inputChange', (data) => {
      console.log('Received outputChange:', data);
      
      setNewOutput((prevOutputs) => {
        const updatedOutputs = [...prevOutputs];
        updatedOutputs[data.index] = data.value;
        return updatedOutputs;
      });
    });
    socket.on('inputHistorical', (data)=>{
      setHistorialRef((historialRef) =>{
        const updatedHistorialRef = [...historialRef];
        updatedHistorialRef[data.index] = data.value;
        return updatedHistorialRef;
      })
    });

    return () => {
      socket.disconnect();
    };
  }, [title]);

  useEffect(() => {
    const handleSelectionChange = () => {
      let select = document.getSelection();
      let text = select.toString();
      if (select && text) {
        let rect = select.getRangeAt(0).getBoundingClientRect();
        setActiveSelect(true);
        setPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setActiveSelect(false);
        setPosition(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const handleSaveAll = async () => {
    const updatedStoryData = [...data.storyData];
    for (let i = 0; i < updatedStoryData.length; i++) {
      try {
        updatedStoryData[i] = {
          ...updatedStoryData[i],
          output: newOutput[i],
          historialReference: historialRef[i]
        };

        await axios.put(`/api/UpdateDataByTitle`, {
          title: data.title,
          storyData: updatedStoryData
        });

        setData((prevData) => ({
          ...prevData,
          storyData: updatedStoryData
        }));
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }
  };

  const handleSave = async () => {
    const updatedStoryData = [...data.storyData];
    try {
      updatedStoryData[index] = {
        ...updatedStoryData[index],
        output: newOutput[index],
        historialReference: historialRef[index]
      };

      await axios.put(`/api/UpdateDataByTitle`, {
        title: data.title,
        storyData: updatedStoryData
      });

      setData((prevData) => ({
        ...prevData,
        storyData: updatedStoryData
      }));
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleSetHistorialRef = () => {
    const updatedHistorialRef = [...historialRef];
    updatedHistorialRef[index] = document.getSelection().toString();
    setHistorialRef(updatedHistorialRef);
    if (socketConnection) {
      socketConnection.emit("outputHistorical", { index: index, value: updatedHistorialRef[index] });
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get(`/api/export?title=${encodeURIComponent(title)}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document.json');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleNextIndex = () => {
    if (index < data.storyData.length - 1) {
      setIndex(index + 1);
    }
  };

  const handlePreviousIndex = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleOutputChange = (value, idx) => {
    const updatedOutput = [...newOutput];
    updatedOutput[idx] = value;
    setNewOutput(updatedOutput);
    if (socketConnection) {
      socketConnection.emit("outputChange", { index: idx, value: updatedOutput[idx] });
    }
  };

  if (!data) {
    return (
      <div className='flex'>
        <SideBar />
        <div className='flex bg-darkSurface-100 min-h-screen w-[100%] justify-center items-center flex-col gap-10'>
          <h1 className='text-offWhite text-2xl'>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <SideBar />
      <div className='flex bg-darkSurface-100 min-h-screen w-[100%] justify-center items-center flex-col gap-10'>
        <h1 className='text-offWhite text-2xl'>Current Dataset: {data.title}</h1>
        <button className='button' onClick={handleExport}>Export</button>
        <div>
          <InputCard 
            Instruction={data.storyData[index]?.instruction}
            Story={data.storyData[index]?.input}
            Output={newOutput[index]}
            PreviousOutPut
            onOutputChange={(value) => handleOutputChange(value, index)}
            HistorialRef={data.storyData[index]?.historialReference || historialRef[index]}
            CurrentIndex={index + 1}
            TotalIndex={data.storyData.length}
          />
          <div className='flex justify-center items-center gap-6 p-3'>
            <button onClick={handlePreviousIndex} className='button'>Previous</button>
            <button onClick={handleNextIndex} className='button'>Next</button>
            <button onClick={handleSave} className='button'>Save</button>
            <button onClick={handleSaveAll} className='button'>Save All</button>
            {activeSelect && (
              <button onClick={handleSetHistorialRef} className='button'>Set historial reference</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotatingPage;
