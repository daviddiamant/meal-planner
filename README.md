GIF of the browse UX | The browse section | The recipe page
:------------:|:------------------:|:---------------:
![Alt text](demo.gif?raw=true "Meal planner UI GIF")|![Alt text](demo1.jpg?raw=true "Meal planner UI browse")|![Alt text](demo2.jpg?raw=true "Meal planner UI recipe page")

GIF of the profile UX | The log in page | The profile page
:------------:|:------------------:|:---------------:
![Alt text](demo1.gif?raw=true "Meal planner UI GIF")|![Alt text](demo3.jpg?raw=true "Meal planner log in")|![Alt text](demo4.jpg?raw=true "Meal planner UI profile page")

This is an application for saving your recipes. Just like that magical cookery book your grandparents keep that is full of tasty treats, but online!

You just input a URL to the recipe you want to save and the application will:
1. Save the information about the recipe in a local db.
2. Save an image(if it could be detected).
3. Save a screenshot of the given URL, in case the URL is not available when it's your turn to show the grandkids.

### Version
This is an unfinished version. To inspect the old version see branch "old-version".

**Missing functionality from the old-version**

- Ability to plan the recipes for a week.
- Ability to share that week.
- Desktop/tablet UI.
- Offline experience (i.e. service worker)

**Other TODOs**

- Search.
- Ability to add notes to a recipe.
- Favorites.
- Export PDF (You know, to hand over to the grandkids).
- Dark mode.
- Random draw from the recipes.

### Tech
The application is served using NGINX (Static assets such as the React app and images, reverse proxy) and a Node API in Fastify.
The recipes are mined with Puppeteer.
The data are stored in MongoDB.
The front-end is written in React, with Redux, Redux-saga and Fela.

How to run
------
These are the instructions for running the app yourself.

### Prerequisites
* npm - [https://www.npmjs.com/](https://www.npmjs.com/)
* Node.js - [https://nodejs.org/en/](https://nodejs.org/en/)
* MongoDB - [https://www.mongodb.com/](https://www.mongodb.com/)
* NGINX - [https://www.nginx.com/](https://www.nginx.com/)
* SSL Key and Cert.

    If it's just supposed to be running locally, just run this in /meal-planner:

    ```
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
    ```

### How to:
Navigate to front/ and run:
```
npm install
npm run-script build
```
Then navigate to back/ and run:
```
npm install
node server.js  </dev/null &>/dev/null &
```
Then to the root of the project and open "meal-planner.conf". Change all file-paths to match your system. I.e. all paths starting with "/home/ubuntu/" in the file.

Make sure NGINX is running. Create a sym-link of "meal-planner.conf" to enabled sites:
```
ln -s PATH_TO_meal-planner.conf /etc/nginx/sites-enabled/
```
And then reload NGINX config:
```
nginx -s reload
```
