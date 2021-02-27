#!/bin/sh

currentFileName=$(ls build | grep "index")
currentVersion=$(echo $currentFileName | grep -o "[0-9]\+")
mv "build/$currentFileName" "build/indexv$(($currentVersion + 1)).html"
sed -i '' "s/$currentFileName/indexv$(($currentVersion + 1)).html/g" frontend-formation.yaml

aws s3 rm s3://meal-planner-frontend --recursive
aws s3 cp build s3://meal-planner-frontend --recursive
aws cloudformation update-stack --stack-name meal-planner-frontend --template-body file://frontend-formation.yaml