const express = require('express');
const userRoute = require('./userAuth.route');
const postRoute=require('./post.route')
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const commentRoute = require('./comment.route');
const profileRoute = require('./profile.route');
const storyRoute = require('./story.route');
const router = express.Router();

const defaultRoutes = [
  
  { path: '/user', route: userRoute },
  { path: '/post', route: postRoute },
  { path: '/comment', route: commentRoute },
  { path: '/profile', route: profileRoute },
  {path:'/story', route: storyRoute}
  
  
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
