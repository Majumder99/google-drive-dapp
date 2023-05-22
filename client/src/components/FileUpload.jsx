/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ account, provider, contract }) => {
  const [fileName, setFileName] = useState("No image selected");
  const [file, setFile] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `92346693fa2e0ff6d199`,
            pinata_secret_api_key: `d78281b8b2cb29dccd7ba457101fa949615e86560fd252c2538e90692d6da0d2`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("res", resFile);
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log("Img hash", ImgHash);
        await contract.add(account, ImgHash);
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        console.log("Unable to upload image to pinata", e);
        // alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      }
    }
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0]; //files array of files object
    console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };
  return (
    <>
      <div className="top">
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="file-upload" className="choose">
            Choose Image
          </label>
          <input
            disabled={!account}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
          />
          <span className="textArea">Image: {fileName}</span>
          <button type="submit" className="upload" disabled={!file}>
            Upload File
          </button>
        </form>
      </div>
    </>
  );
};

export default FileUpload;
