import { body } from "express-validator";

const makeNameValidator = () =>
  body("title")
    .exists()
    .withMessage("title is required")
    .bail()
    .isString()
    .withMessage("title must be a string")
    .bail()
    .notEmpty()
    .withMessage("title cannot be empty");

const makeURLValidator = () =>
  body("profilePictureURL").optional().isString().withMessage("description must be a string");

export const createUser = [makeNameValidator(), makeURLValidator()];
