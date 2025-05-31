import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all videos with pagination, filter, sorting
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const filter = {};
    if (query) filter.title = { $regex: query, $options: "i" };
    if (userId) filter.owner = userId;

    const sortOrder = sortType === "asc" ? 1 : -1;

    const videos = await Video.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("owner", "username");

    const total = await Video.countDocuments(filter);

    res.status(200).json(new ApiResponse(200, { videos, total, page: Number(page) }, "Videos fetched successfully"));
});

// Publish a video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const ownerId = req.user?._id;

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video or thumbnail file missing");
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload?.url || !thumbnailUpload?.url) {
        throw new ApiError(500, "Cloudinary upload failed");
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        owner: ownerId
    });

    await User.findByIdAndUpdate(ownerId, { $push: { videos: video._id } });

    res.status(201).json(new ApiResponse(201, video, "Video uploaded successfully"));
});

// Get video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("owner", "username");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Update video
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const updatePayload = {};
    if (title) updatePayload.title = title;
    if (description) updatePayload.description = description;

    if (req.files?.thumbnail?.[0]?.path) {
        const thumbnailUpload = await uploadOnCloudinary(req.files.thumbnail[0].path);
        if (!thumbnailUpload?.url) throw new ApiError(500, "Failed to upload new thumbnail");
        updatePayload.thumbnail = thumbnailUpload.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updatePayload, { new: true });

    if (!updatedVideo) throw new ApiError(404, "Video not found");

    res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

// Delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    await User.findByIdAndUpdate(video.owner, { $pull: { videos: videoId } });
    await video.deleteOne();

    res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
});

// Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiResponse(200, video, "Publish status toggled"));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};
