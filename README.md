# auto-closet

Welcome to the Auto-Closet!

This is an ongoing project I'm working on to provide a way to help people choose and create outfits.

The site will feature an option to upload pictures of your clothes, match them against eachother to see what works, and 
create an outfit that can be saved for later use.

I made this project because I never used to have any sense of style, and I thought this would be a good way for people who are in 
the same position to try and learn a little more about how to put together different pieces that they own. 

For now the website is not publicly hosted, due to worries of cost. For this reason there will be a short video demoing the website 
on the site's github repo: https://github.com/christianMlane011/auto-closet


The Tech:

The site's backend is built on NodeJS using the express framework for routing.
3 main routers exist, these being the user authentication router, the image upload router, and the clothing router.
Each of these routers contain just the routes themselves, with the logic behind each route coming from a controller for each router, named
similarly to it's router. 

The user authentication router handles user signups, logins, and logouts.
The image upload router handles uploading any images the user wants to add to their clothing page.
The clothing router handles displaying the clothing that is linked with the user account, as well as creating outfits, storing them, and displaying them on the outfits page.
Several of the routes are restricted to users that are signed in using a piece of middleware.
Also, for all the pages on the site, a piece of middleware is used to determine who the signed in user is, if any, so that their email can be displayed in a welcome message.

The user account are stored on MongoDB accessed by using mongoose. The user accounts are stored with their email, a hashed password,
an array of the images uploaded to their account, and an array of outfits, which are images from different categories combined. 

The images themselves are not stored in MongoDB, but instead links to the images are stored which are then inserted into individual
image tags to display for the user. The images are stored in a s3 bucket. S3 uploads are handled using multer-s3, a storage engine for AWS s3. 

The site's front end uses EJS as a view engine, with 6 full views, and 2 partials existing in every view, these being the header and the nav. 
Other than this the front end is pretty standard html/css, with a bit of javascript. 

