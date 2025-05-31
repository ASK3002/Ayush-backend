import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle subscription: subscribe or unsubscribe
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (String(channelId) === String(subscriberId)) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId,
    });

    if (existingSubscription) {
        // unsubscribe
        await existingSubscription.deleteOne();
        return res.status(200).json(
            new ApiResponse(200, null, "Unsubscribed successfully")
        );
    } else {
        // subscribe
        const subscription = await Subscription.create({
            channel: channelId,
            subscriber: subscriberId,
        });
        return res.status(201).json(
            new ApiResponse(201, subscription, "Subscribed successfully")
        );
    }
});

// Get all subscribers of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "username email");

    res.status(200).json(
        new ApiResponse(200, subscribers, "Fetched channel subscribers")
    );
});

// Get all channels a user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const channels = await Subscription.find({ subscriber: subscriberId }).populate("channel", "username email");

    res.status(200).json(
        new ApiResponse(200, channels, "Fetched subscribed channels")
    );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};
