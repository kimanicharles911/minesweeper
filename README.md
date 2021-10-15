# Minesweeper Game (Reactjs, Bootstrap) 
## Description
* This is the repository that holds the source code of [My Minesweeper Game](https://gittedminesweeper.netlify.app/).  It has been developed using Reactjs and bootstrap.

## Deployed at
* [gittedminesweeper.netlify.app](https://gittedminesweeper.netlify.app/)


## Game Rules
##### Objective and basic concepts
```
The objective in Minesweeper is to find and mark all the mines hidden under the grey squares, in the shortest time possible. This is done by clicking on the squares to open them. Each square will have one of the following:
1. A mine, and if you click on it you'll lose the game.
2. A number, which tells you how many of its adjacent squares have mines in them.
3. Nothing. In this case you know that none of the adjacent squares have mines, and they will be automatically opened as well.
It is guaranteed that the first square you open won't contain a mine, so you can start by clicking any square. Often you'll hit on an empty square on the first try and then you'll open up a few adjacent squares as well, which makes it easier to continue. Then it's basically just looking at the numbers shown, and figuring out where the mines are.
```
##### Gameplay
```
There are essentially two actions you can take in Minesweeper:
1. Open a square. This is done simply by left clicking on a square.
2. Marking a square as a mine. This is done by right clicking on a square. The square will turn to color yellow.
```

##### Winning
```
You've won the game when you've opened all squares that don't contain a mine meaning the mines left will show zero, the game status will show a smiling emoji with sunglasses (😎) you will also be alerted.
```

##### Losing
```
You've lost the game when you click on a square with a mine and all mine boxes turn red. The game status will show a smiling emoji with a downcast sweaty face (😓).
```

```
From cardgames.io/minesweeper/#rules
```

## Setup/Installation Requirements
##### Install Dependencies

```
npm install
```

##### Run React Development Server

```
npm run start
```

##### To Build for Production

```
npm run build
Know how to host at heroku.com - https://dev.to/destrodevshow/how-to-deploy-react-app-to-heroku-in-5-minutes-3dni

heroku login
git add . && git commit -m"your commit message" && git push heroku master
```

## How It Was Built
##### Create React App
```
npx create-react-app
npm i --save bootstrap
npm i --save react-bootstrap
```
##### Dependencies
* Bootstrap
* React Bootstrap

### src folder structure
```
src/
  Components/
    GameOptionsComponent.css
    GridTableComponent.jsx   
    StatusScreenComponent.jsx
    GameOptionsComponent.jsx
    HeaderComponent.js
    GridTableComponent.css  
    StatusScreenComponent.css
  App.css
  App.test.js
  index.css
  logo.svg
  setupTests.js
  App.jsx
  index.js 
  reportWebVitals.js
```

## License and Copyright Information.
See [my MIT LICENSE](https://github.com/kimanicharles911/minesweeper/blob/master/LICENSE.txt) for details.