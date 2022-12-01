#!/bin/bash

npm run build
npm run cdk -- deploy --require-approval never

aws cloudfront create-invalidation \
    --distribution-id E2SGLV230CCG8T \
    --paths "/manifest.webmanifest" "/index.html" "/sw.js"