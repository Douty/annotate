import React from 'react';
import axios from 'axios';

function Download() {
    const handleDownload = () => {
        axios.get('/api/download', { responseType: 'blob' })
            .then(res => {
                console.log("Download!");
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'data.csv');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(err => {
                console.error("Error downloading:", err);
            });
    };

    return (
        <div className='flex flex-col justify-center items-center min-h-screen bg-blacksteel'>
            <div className='flex  flex-col text-center bg-floralwhite h-[500px] w-[500px] rounded-xl justify-center items-center gap-3'>
              <h1 className='text-3xl'>Your annotation data is ready to download</h1>
              <button className='button-style' onClick={handleDownload}>Download</button>  
            </div>
            
        </div>
    );
}

export default Download;
