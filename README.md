|                 GIF of the browse UX                 |                    The browse section                    |                        The recipe page                        |
| :--------------------------------------------------: | :------------------------------------------------------: | :-----------------------------------------------------------: |
| ![Alt text](demo.gif?raw=true "Meal planner UI GIF") | ![Alt text](demo1.jpg?raw=true "Meal planner UI browse") | ![Alt text](demo2.jpg?raw=true "Meal planner UI recipe page") |

|                 GIF of the profile UX                 |                    The log in page                    |                        The profile page                        |
| :---------------------------------------------------: | :---------------------------------------------------: | :------------------------------------------------------------: |
| ![Alt text](demo1.gif?raw=true "Meal planner UI GIF") | ![Alt text](demo3.jpg?raw=true "Meal planner log in") | ![Alt text](demo4.jpg?raw=true "Meal planner UI profile page") |

This is an application for saving your recipes. Just like that magical cookery book your grandparents keep that is full of tasty treats, but online!

You just input a URL to the recipe you want to save and the application will:

1. Save the information about the recipe in a local db.
2. Save an image(if it could be detected).
3. Save a screenshot of the given URL, in case the URL is not available when it's your turn to show the grandkids.

### Version

This is an unfinished version. To inspect the old version see branch "old-version".

**Missing functionality from the old-version**

- Desktop/tablet UI.

**Other TODOs**

- Search.
- Ability to add notes to a recipe.
- Favorites.
- Export PDF (You know, to hand over to the grandkids).
- Dark mode.
- Random draw from the recipes.

### Tech

The backend is built using the Serverless Framework and Koa.
The recipes are mined with Puppeteer.
The data are stored in MongoDB.
The front-end is written in React, with Redux, Redux-saga and Fela.
