import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../errors";
import Course from "../models/Course";
import CourseReview from "../models/CourseReview";
import User from "../models/User";

interface IQueryObject {
  [x: string]: any;
  $and?: (
    | {
        $or: any;
      }
    | {
        subj: any;
      }
    | { $nor: any }
  )[];
}

const getAllCourses = async (req: Request, res: Response) => {
  const { search, subj } = req.query;

  let queryObject: IQueryObject = {
    subj,
  };

  if (subj === "ACC/BUS") {
    queryObject = {
      $or: [{ subj: "ACC" }, { subj: "BUS" }],
    };
  }

  if (subj === "EST/EMP") {
    queryObject = {
      $or: [{ subj: "EST" }, { subj: "EMP" }],
    };
  }

  if (subj === "SHCourse") {
    queryObject = {
      $nor: [
        { subj: "AMS" },
        { subj: "ACC" },
        { subj: "BUS" },
        { subj: "CSE" },
        { subj: "ESE" },
        { subj: "EST" },
        { subj: "EMP" },
        { subj: "MEC" },
      ],
    };
  }

  if (search && subj !== "SHCourse") {
    if (subj === "ACC/BUS") {
      queryObject = {
        $and: [
          {
            $or: [
              { crs: { $regex: search, $options: "i" } },
              { courseTitle: { $regex: search, $options: "i" } },
              { instructor_names: { $regex: search, $options: "i" } },
            ],
          },
          { $or: [{ subj: "ACC" }, { subj: "BUS" }] },
        ],
      };
    } else if (subj === "EST/EMP") {
      queryObject = {
        $and: [
          {
            $or: [
              { crs: { $regex: search, $options: "i" } },
              { courseTitle: { $regex: search, $options: "i" } },
              { instructor_names: { $regex: search, $options: "i" } },
            ],
          },
          { $or: [{ subj: "EST" }, { subj: "EMP" }] },
        ],
      };
    } else {
      queryObject = {
        $and: [
          {
            $or: [
              { crs: { $regex: search, $options: "i" } },
              { courseTitle: { $regex: search, $options: "i" } },
              { instructor_names: { $regex: search, $options: "i" } },
            ],
          },
          { subj },
        ],
      };
    }
  } else if (search && subj === "SHCourse") {
    queryObject = {
      $and: [
        {
          $or: [
            { crs: { $regex: search, $options: "i" } },
            { courseTitle: { $regex: search, $options: "i" } },
            { instructor_names: { $regex: search, $options: "i" } },
          ],
        },
        {
          $nor: [
            { subj: "AMS" },
            { subj: "ACC" },
            { subj: "BUS" },
            { subj: "CSE" },
            { subj: "ESE" },
            { subj: "EST" },
            { subj: "EMP" },
            { subj: "MEC" },
          ],
        },
      ],
    };
  }

  let result = Course.find(queryObject);

  if (subj === "SHCourse") {
    result = result.sort("subj");
  } else if (subj !== "ACC/BUS") {
    result = result.sort("crs");
  }

  //setup pagination
  const finalPage = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 16;
  const skip = (finalPage - 1) * limit;

  result = result.skip(skip).limit(limit);

  const allCourses = await result;
  const totalCourses = await Course.countDocuments(queryObject);
  const courseNumOfPages = Math.ceil(totalCourses / limit);

  res.status(StatusCodes.OK).json({
    allCourses,
    totalCourses,
    courseNumOfPages,
  });
};

const likeCourse = async (req: Request, res: Response) => {
  const { id: courseId } = req.query;

  const course = await Course.findOne({ _id: courseId });

  if (!course) {
    throw new NotFoundError(`No course with id: ${courseId}`);
  }

  if (course.likes.includes(req.user?.userId as string)) {
    const index = course.likes.indexOf(req.user?.userId as string);
    course.likes.splice(index, 1);
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { likes: course.likes }
    );
    res.status(StatusCodes.OK).json({ updatedCourse });
  } else {
    course.likes.push(req.user?.userId as string);
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { likes: course.likes }
    );
    res.status(StatusCodes.OK).json({ updatedCourse });
  }
};

const getSingleCourse = async (req: Request, res: Response) => {
  const { id: courseId } = req.params;

  const course = await Course.findOne({ _id: courseId });

  if (!course) {
    throw new NotFoundError(`No course with id: ${courseId}`);
  }

  course.reviews = await CourseReview.find({ course: courseId });

  res.status(StatusCodes.OK).json({ course });
};

const createReview = async (req: Request, res: Response) => {
  const {
    params: { id: courseId },
    body: {
      semester,
      homeworkQuantity,
      teamProjectPresence,
      difficulty,
      testQuantity,
      quizPresence,
      overallGrade,
      instructor,
    },
  } = req;

  const course = await Course.findOne({ id: courseId });
  console.log(courseId);

  if (!course) {
    throw new NotFoundError(`No course with id: ${courseId}`);
  }

  if (
    semester === "-1" ||
    !homeworkQuantity ||
    teamProjectPresence === null ||
    !difficulty ||
    testQuantity === null ||
    quizPresence === null ||
    !overallGrade ||
    instructor === "-2"
  ) {
    throw new BadRequestError("Please provide all values");
  }

  var ObjectId = mongoose.Types.ObjectId;
  const alreadyCourse = await CourseReview.findOne({
    createdBy: new ObjectId(req.user?.userId),
    course: new ObjectId(courseId),
  });

  if (alreadyCourse) {
    throw new BadRequestError(
      "You already submitted course review for this course :)"
    );
  }

  req.body.createdBy = req.user?.userId;
  req.body.course = courseId;

  const fetchUsername = async (userId: string) => {
    return User.findOne({ _id: userId }).then((user) => user?.username);
  };
  let username = await fetchUsername(req.user?.userId as string);
  req.body.createdByUsername = username;

  const courseReview = await CourseReview.create(req.body);
  course.reviews.push(courseReview._id);
  course.save();

  res.status(StatusCodes.CREATED).json({ courseReview });
};

const likeReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;

  const review = await CourseReview.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`);
  }

  if (review.likes.includes(req.user?.userId as string)) {
    const index = review.likes.indexOf(req.user?.userId as string);
    review.likes.splice(index, 1);
    const updatedReview = await CourseReview.findOneAndUpdate(
      { _id: reviewId },
      { likes: review.likes }
    );
    res.status(StatusCodes.OK).json({ updatedReview });
  } else {
    review.likes.push(req.user?.userId as string);
    const updatedReview = await CourseReview.findOneAndUpdate(
      { _id: reviewId },
      { likes: review.likes }
    );
    res.status(StatusCodes.OK).json({ updatedReview });
  }
};

const updateUserCourseNum = async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.user?.userId });

  user!.courseReviewNum++;

  await user?.save();

  const token = user?.createJWT();

  res.status(StatusCodes.OK).json({ user, token });
};

export {
  getAllCourses,
  likeCourse,
  getSingleCourse,
  createReview,
  likeReview,
  updateUserCourseNum,
};
