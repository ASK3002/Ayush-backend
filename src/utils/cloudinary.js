import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary=async (localFilePAth)=>{
    try{
        if(!localFilePAth) return null;
        //uploading file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePAth,{
            resource_type:"auto"
        })
        //file has been uploaded successfully
        // console.log("File is uploaded on cloudinary",
        // response.url);
        fs.unlinkSync(localFilePAth);//remove the localy saved temporary saved file

        return response;

    }catch(error){
        fs.unlinkSync(localFilePAth);//remove the localy saved temporary saved file as the operation got failed
        return null;
    }
}

export {uploadOnCloudinary};
