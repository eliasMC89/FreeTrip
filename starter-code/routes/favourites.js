const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const activityMiddleware = require('../middlewares/activityMiddleware');
const User = require('../models/user');

router.get('/', authMiddleware.requireUser, (req, res, next) => {
  const { _id } = req.session.currentUser;
  User.findById(_id)
    .populate('favourites')
    .then((user) => {
      res.render('favourites/list-favourites', { user });
    })
    .catch(next);
});

router.post('/:userId/addFavourite/:activityId', activityMiddleware.checkUserFavouriteActivities, (req, res, next) => {
  const userId = req.session.currentUser;
  const activityId = req.params.activityId;
  User.findByIdAndUpdate(userId, { $push: { favourites: activityId } })
    .then(() => {
      return res.redirect('/activities');
    });
});

module.exports = router;
