import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get paginated comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const comments = await Comment.aggregatePaginate(
        Comment.aggregate([
            { $match: { video: new mongoose.Types.ObjectId(videoId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: "$owner" },
            { $sort: { createdAt: -1 } }
        ]),
        { page: Number(page), limit: Number(limit) }
    );

    res.status(200).json(new ApiResponse(200, comments, "Comments fetched"));
});

// Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    res.status(201).json(new ApiResponse(201, comment, "Comment added"));
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findOne({ _id: commentId, owner: req.user._id });

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json(new ApiResponse(200, comment, "Comment updated"));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user._id
    });

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, null, "Comment deleted"));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
