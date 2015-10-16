# Project Two - DEFLATE THIS FORUM

## Technologies used

- html
- CSS
- javascript
- node
- express / express layouts / sessions / express-ejs-layouts
- ejs
- sessions
- bcryptjs
- mongo/mongod/mongoose
- body-parser
- morgan
- git / github
- heroku
- bootstrap
- google fonts

## Installation Instructions

- Use the below link to view the app hosted on heroku
- Create a user profile and log in in subsequent sessions
- use the football for navigation menu
- https://vast-chamber-6524.herokuapp.com/

## Approach taken

- After meeting with Greg and wire framing I decided the best choice was to build out a server.js file with everything required, create all the different views folders and files, models, and controllers.
- Once all the necessary technology was required I began to write out my necessary pathways in a single controller. I later realized creating multiple controllers would be more practical.
- I built just enough html to make it possible to navigate through the different pages. From there I made sure to fulfill all the CRUD functions with database capabilities for posts and users.
- After creating all CRUDs I added some extra functions like comments, up/down votes and sorting by vote score. I had help from Huntington on this, he was super helpful.
-  From there I added some extras like bcrypt and finding all posts by users. Can't have any hackers getting in to my stuff!
- Lastly, I spent the final day of the project timeline styling. I first used bootstrap to style the forms and buttons. Then got crazy and added an animated rotating football, and sliding user and nav menus. I used CSS for all of these.
- During the last day I also implemented the locals variable.
- Finally I added a background image and styled all my pages to make them clean and consistent.
- Lastly, after testing and having others use the app I added a homepage that login and the home link redrects to.

## Problems and future tasks
- I would like to add nesting comments and tags to my app.
- I would also like to add flash messages so when a user fails to log in they know why, and what they did wrong. Because you can not move around the site until you are logged in.
- I would also like to place the post button in the feed of posts later better. I had a lot of difficulties moving it around.
- I would also like to work on finding a better background image and size it better.
- One last thing is working more with the auto populating drop downs. Styling them better and also having them auto populate in edit fields is something I would like to work on.
