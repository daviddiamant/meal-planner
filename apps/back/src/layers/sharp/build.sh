SHARP_VERSION=$(npm show sharp version)
NODE_VERSION=16.18.1
TARBALL=sharp-$SHARP_VERSION-aws-lambda-linux-x64-node-$NODE_VERSION.zip

cd nodejs
npm install
cd ..

zip -r $TARBALL nodejs