"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseSchema = new mongoose_1.Schema({
    classNbr: {
        type: String,
        required: true,
    },
    subj: {
        type: String,
        required: true,
    },
    crs: {
        type: String,
        requred: true,
    },
    courseTitle: {
        type: String,
        required: true,
    },
    sbc: {
        type: String,
        requred: true,
    },
    cmp: {
        type: String,
        requred: true,
    },
    sctn: {
        type: String,
        requred: true,
    },
    credits: {
        type: String,
        required: true,
    },
    day: {
        type: [
            {
                any: String,
            },
        ],
        required: true,
    },
    startTime: {
        type: [
            {
                any: String,
            },
        ],
        required: true,
    },
    endTime: {
        type: [
            {
                any: String,
            },
        ],
        required: true,
    },
    room: {
        type: [
            {
                any: String,
            },
        ],
        required: true,
    },
    instructor: {
        type: [
            {
                any: String,
            },
        ],
        required: true,
    },
    likes: {
        type: [String],
        required: true,
        default: [],
    },
    reviews: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "CourseReview",
        },
    ],
});
exports.default = (0, mongoose_1.model)("Course", CourseSchema);
