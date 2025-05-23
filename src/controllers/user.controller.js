import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOncloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async (req,res)=>{
    //get user details from frontend
    
    const {fullname,email,username,password}=req.body
    console.log("email :",email);

    //validation --not empty


    // if(fullname===""){
    //     throw new ApiError(400,"Fullname is required");
    // }
    if(
        [fullname,email,username,password].some((field) =>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required");
    }


    
    //check if user already exists : username , email
    const existedUser=User.findOne({
        $or:[{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }



    //check for images , check for avatar
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required");
    }

    //upload them to cloudinary, avatar
    const avatar=await uploadOncloudinary(avatarLocalPath)
    const coverImage=await uploadOncloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar is required");
    }

    //create user object - create entry in db
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })


    //remove password and refresh token field for response
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check for user creation
    if(createdUser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }
    
    
    

    //return response if not created return error
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    );

})

export {registerUser};