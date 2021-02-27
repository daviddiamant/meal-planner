#!/bin/sh

if [ -d "build" ]; then
  currentVersion=$(ls build | grep "index")
else
  currentVersion=indexv1.html
fi

rm -rf build

node_modules/.bin/react-app-rewired build

mv build/index.html "build/$currentVersion"
