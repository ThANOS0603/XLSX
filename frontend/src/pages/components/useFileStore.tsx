async function handleSubmitFile(e: any) {
    e.preventDefault();
    if (files.length === 0) {
      alert("please upload a file ")
      return;
    } 
    console.log("uploading file ...");
    const formData = new FormData();
    files.forEach(file=>{
      formData.append("file", file);
    })
    formData.append("process", process);
    formData.append("sub_process",subProcess)
    console.log("formData:")
    console.log(formData);
    setUploadStatus('processing');
    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("form response", response.data);
      if(response.status==200){
        setUploadStatus('sucess')
        setFileName(response.data.file_name)
        alert("Files uploaded and Processed successfully.");
      } else{
        throw new Error(`processing files failed with status : ${response.status}`)
      }
    
    } catch (error) {
      setUploadStatus('error');
      console.error("Error uploading files:", error);
      alert("Failed to upload and process files.");
    }
  }

  async function handleDownload() {
    if (!fileName) {
      alert("No file available to download. Please upload and process a file first.");
      return;
    }
  
    const fileUrl = `http://localhost:5000/static/${fileName}`;  
  
    try {
      const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'blob',  
      });
  
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response.data]));
      link.setAttribute('download', fileName);  // Set the download attribute (filename)
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Failed to download the file.");
    }
  }

  const handleDownloadFile = async () => {
    if (!fileName) {
        alert("No file available for download.");
        return;
    }
    console.log("Preparing to download file...");

    try {
        const response = await axios.get(`http://localhost:5000/download_excel/${fileName}`);
        const data = await response.data;
        if (data.file_url) {
          // Triggering the download
          window.open(data.file_url, '_blank');
          return "Download initiated!";
        } else {
          console.error('File URL not available');
          return "Failed to initiate download.";
        }
      } catch (error) {
        console.error('Error:', error);
        return "Failed to retrieve the file.";
      }
};