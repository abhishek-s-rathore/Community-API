var express = require('express');
const auth = require('../middlewares/auth');
let Profile = require('../models/ProfileModel');
var User = require('../models/UserModel');
var router = express.Router();

//Registrating The User
router.post('/register', async function (req, res, next) {
  let data = req.body;
  try {
    let user = await User.create(data);
    let token = await user.signToken();
    user = await user.userJSON(token);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

//Authentication Of  User
router.post('/login', async function (req, res, next) {
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email/Password required' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User is not registered' });
    }

    let result = await user.verifyPassword(password);

    if (!result) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    let token = await user.signToken();
    user = await user.userJSON(token);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

//Authorization Of Routes Using This Verify Token Middleware
router.use(auth.verifyToken);

//Get Current User Data
router.get('/currentUserData', async (req, res, next) => {
  let payload = req.user;
  let token = req.headers.authorization;
  try {
    let user = await User.findOne({ username: payload.username });
    res.json({ user: await user.userJSON(token) });
  } catch (error) {
    nnext(error);
  }
});

//Follow User
router.get('/follow/:id', async (req, res, next) => {
  let userId = req.params.id;
  let loggedprofile = req.user;
  try {
    let loggedUser = await User.findOne({ username: loggedprofile.username });
    console.log(loggedUser.following.includes(userId));
    if (userId === loggedUser.id) {
      return res.status(400).json({ error: 'User cant follow himself' });
    } else if (loggedUser.following.includes(userId)) {
      return res
        .status(400)
        .json({ error: 'User cannot follow same person twice' });
    } else {
      let updatedTargetUser = await User.findByIdAndUpdate(userId, {
        $push: { followers: loggedUser.id },
      });

      let updatedUser = await User.findByIdAndUpdate(loggedUser.id, {
        $push: { following: userId },
      });

      return res.json({ updatedUser, updatedTargetUser });
    }
  } catch (error) {
    next(error);
  }
});

//Unfollow User
router.get('/unfollow/:id', async (req, res, next) => {
  let userId = req.params.id;
  let loggedprofile = req.user;
  try {
    let loggedUser = await User.findOne({ username: loggedprofile.username });

    if (userId === loggedUser.id) {
      return res.status(400).json({ error: 'You cannot unfollow yourself' });
    } else if (!loggedUser.following.includes(userId)) {
      return res
        .status(400)
        .json({ error: 'You can not follow same person twice' });
    } else {
      let updatedTargetUser = await User.findByIdAndUpdate(userId, {
        $pull: { followers: loggedUser.id },
      });

      let updatedUser = await User.findByIdAndUpdate(loggedUser.id, {
        $pull: { following: userId },
      });

      return res.json({ updatedUser, updatedTargetUser });
    }
  } catch (error) {
    next(error);
  }
});

//Block User By Administrator
router.get('/block/:name', async (req, res, next) => {
  let username = req.params.name;

  try {
    let updateduser = await User.findOneAndUpdate(
      { username },
      { isBlocked: true }
    );

    let updatedProfile = await Profile.findOneAndUpdate(
      { username },
      { isBlocked: true }
    );

    return res.json({ updatedProfile });
  } catch (error) {
    next(error);
  }
});

//Unblock User By Administrator
router.get('/unblock/:name', async (req, res, next) => {
  let username = req.params.name;

  try {
    let updateduser = await User.findOneAndUpdate(
      { username },
      { isBlocked: false }
    );

    let updatedProfile = await Profile.findOneAndUpdate(
      { username },
      { isBlocked: false }
    );

    return res.json({ updatedProfile });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
