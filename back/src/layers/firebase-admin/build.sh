FIREBASE_VERSION=$(npm show firebase-admin version)
NODE_VERSION=12.19.0
TARBALL=firebase-admin-$FIREBASE_VERSION-aws-lambda-linux-x64-node-$NODE_VERSION.zip

cd nodejs
npm install
cd ..

zip -r $TARBALL nodejs