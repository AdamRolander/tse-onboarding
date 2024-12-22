import { RequestHandler } from "express";
import TaskModel from "src/models/task";

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    const task = await TaskModel.find({}).sort({ dateCreated: -1 });

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
