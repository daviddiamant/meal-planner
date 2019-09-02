![Alt text](recipes.png?raw=true "Meal planner UI")

This is an application for saving your recipes. Just like that that magical cookery book your grandparents kept that is full of tasty treats, but online!

You just input a URL to the recipe you want to save and the application will:
1. Save the information about the recipe in a local db.
2. Save an image(if it could be detected).
3. Save a screenshot of the given URL, in case the URL is not available when it's your turn to show the grandkids.

### Tech
The application is served using Express in Node.
The data are stored in MongoDB.
The front-end are written in React.
Communication between the front & back-end are done using GraphQL through Apollo.

How to run
------
These are the instructions for running the app yourself.

### Prerequisites
* npm - [https://www.npmjs.com/](https://www.npmjs.com/)
* Node.js - [https://nodejs.org/en/](https://nodejs.org/en/)
* MongoDB - [https://www.mongodb.com/](https://www.mongodb.com/)

    I am running this on my Raspberry Pi with Raspbian, so v. 2.4.14.

    So if you will use something newer than v. 2. There are probably some changes that needs to be made to the MongoDB connection.
* SSL Key and Cert.

    If its just supposed to be running locally, just run this in /recept:

    ```
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
    ```

### How to:
Navigate to /recept/recept-front and run:
```
npm install
npm run-script build
rm -r ../recept-back/build/
mv build ../recept-back/
```
Then navigate to /recept/recept-back and run:
```
npm install
node server.js  </dev/null &>/dev/n
ull &
```