import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get channel stats: total views, subscribers, videos, likes
const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.params.channelId;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Total videos uploaded by the user
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Total views on videos by the user
    const videos = await Video.find({ owner: channelId }).select("views _id");
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);

    // Total likes on videos by the user
    const videoIds = videos.map(video => video._id);
    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    });

    res.status(200).json(new ApiResponse(200, {
        totalVideos,
        totalSubscribers,
        totalViews,
        totalLikes
    }, "Channel stats fetched"));
});

// Get all videos uploaded by the channel
const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.params.channelId;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const videos = await Video.find({ owner: channelId })
        .sort({ createdAt: -1 }) // optional: newest first
        .populate("owner", "username"); // if needed

    res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched"));
});

export {
    getChannelStats,
    getChannelVideos
};
