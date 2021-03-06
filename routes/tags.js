var express = require('express');
const auth = require('../middlewares/auth');
const Question = require('../models/QuestionModel');
let lodash = require('lodash');
var router = express.Router();
router.use(auth.verifyToken);

//Get List Of All Avaialable Tags
router.get('/', async (req, res, next) => {
  try {
    let questions = await Question.find({});
    let arrayOfTags = questions.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);
    arrayOfTags = lodash.flattenDeep(arrayOfTags);
    arrayOfTags = lodash.uniq(arrayOfTags);
    return res.json({ tags: arrayOfTags });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
