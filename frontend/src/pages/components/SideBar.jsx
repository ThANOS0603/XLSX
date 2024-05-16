
"use client";
import React,{useState, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image';
import uploadIcon from '../../asset/icons/upload.svg'
import arrowDown from "../../asset/icons/arrow_down.svg"
import crossIcon from "../../asset/icons/cross.svg"
import documentIcon from "../../asset/icons/documentIcon.svg"
import axios from 'axios';

const uploadUrl=" http://127.0.0.1:5000/upload"

// import uploadSideBar from '../components/uploadsidebar';



function SideBar() {
  const[isOpen, setIsOpen]= useState(true);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);


 
  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      for (let i = 0; i < e.target.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
      }
    }
  }

  async function handleSubmitFile(e: any) {
    e.preventDefault();
    if (files.length === 0) {
      alert("please upload a file ")
      return;
    } 

    console.log("uploading file ...");
    const formData = new FormData();
    Array.from(files).forEach(file=> 
      formData.append("files[]", file)
    )

      try{
        const response= await axios.post(uploadUrl, formData,  {
          headers: {
            'Content-Type': 'multipart/form-data',
            withCredentials: true,
          },
        });

        response.data.files.forEach( (file:string) =>{
          const url=  `${uploadUrl}/${file}`;
          const link = document.createElement('a');
          link.href=url;
          link.setAttribute('download', file);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        } );

      }catch(error){
        console.error("error uploading files:", error);
      }
   



  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }



  return (
    <div className={` ${isOpen ?'w-6/8': 'w-0.5/6'} 
    h-screen bg-gray-100 border-r-2 border-[#0BCEC0] p-2
     transition-width duration-300 ease-in-out z-10`}>
       <p className="text-title1 text-center text-xl font-bold mb-4 mt-2">SOX Assistant</p>
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center h-30 w-6/6 ">
        <form
          className={`${
            dragActive ? "bg-blue-400" : "bg-[#cee3f2]"
          }  
          w-2/3 rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center outline-dashed p-10 m-10`}
          onDragEnter={handleDragEnter}
          onSubmit={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
          
          <input
            placeholder="fileInput"
            className="hidden"
            ref={inputRef}
            type="file"
            name="file"
            multiple={true}
            onChange={handleChange}
            accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
          />
          <Image src={uploadIcon} width={35} height={42} alt={'uploadIcon'}/>
          <p className="text-gray-400 mb-2 text-sm">Text file format : PDF, Doc, Docx</p>
          <p className="text-black-500 font-semibold text-base mb-0.5">
            Drag & Drop files here or{" "}
            <span
              className="font-bold text-white cursor-pointer "
              onClick={openFileExplorer}
            >
              <span className="px-2 py-1 m-2 bg-gray-500 rounded-lg">Browse</span>
            </span>{" "}
          </p>

        

          {/* <button
            className="bg-gray-600 rounded-lg p-2 mt-3 w-auto"
            onClick={handleSubmitFile}
          >
            <span className="p-2 text-white">Submit</span>
          </button> */}
        </form>
      </div>
    </div>

   {/* file preview  */}

     {/* previewIcon */}

     <div className="flex flex-col">
            {files.map((file: any, idx: any) => (
              <div key={idx} className="flex flex-row space-x-5 text-white  bg-[#247BB8] 
              bg-gradient-to-r from-blue-800 to-indigo-900
              rounded-lg p-3 items-center justify-around m-1">
                <div>
                <Image src={documentIcon} alt='document icon' width={28} height={28}/>
                </div>
                <span>{file.name}</span>
                <span
                  className="text-red-500 cursor-pointer"
                  onClick={() => removeFile(file.name, idx)}
                >
                  <Image src={crossIcon} width={30} height={30} alt='crossIcon'/>
                </span>
              </div>
            ))}
          </div>

   
    {/* <div>
      <input type="file" className="file-input file-input-bordered w-full max-w-xs m-2" />
      <br/>
      <button className="btn btn-accent">Upload</button>
    </div> */}

    <div className="w-full p-2 flex justify-between items-center">
        <div className="dropdown dropdown-bottom   RCM">
          <div tabIndex={0} role="button" className="btn m-1 w-[170px] bg-white border-[#0BCEC0]  border-2 justify-start">RCM ▼ </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </div>

        <div className="dropdown dropdown-bottom Process">
          <div className="flex justify-between ">
            <div tabIndex={0} role="button" className="btn w-[170px] bg-white border-[#0BCEC0]  border-2">Process 
            <div><span><Image src={arrowDown} width={20} height={20} alt='arrowDown'/></span></div>
          </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Item 1</a></li>
              <li><a>Item 2</a></li>
            </ul>
          </div>
        </div>

     </div>

    <div className="container w-5/8 mt-6 bg-[#123B57] flex justify-center items-center " >
    <button type="button"  onClick={handleSubmitFile}
     className="bottom-4 h-10
     focus:outline-none w-full text-white bg-[#123B57] font-medium rounded-lg 
     text-sm px-5 py-2.5 mx-6 my-2 dark:bg-green-[#123B57] hover:shadow-md
      ">Show Results

      {/* <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 25 25"><path  d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z" data-name="Right"/></svg> */}
      </button>

    </div>



    </div>

  )
}

export default SideBar;
