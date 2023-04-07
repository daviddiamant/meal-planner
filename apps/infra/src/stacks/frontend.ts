import { App, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  CloudFrontAllowedCachedMethods,
  CloudFrontAllowedMethods,
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from "aws-cdk-lib/aws-cloudfront";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";

export class FrontendStack extends Stack {
  logicalId = "MealPlannerTypescriptFrontend";

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const storage = new Bucket(this, `${this.logicalId}Bucket`, {
      bucketName: "meal-planner-typescript-frontend",
      websiteErrorDocument: "index.html",
      websiteIndexDocument: "index.html",
      cors: [
        {
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
        },
      ],
    });

    const cloudfrontIdentity = new OriginAccessIdentity(
      this,
      `${this.logicalId}-OAI`
    );
    storage.grantRead(cloudfrontIdentity);

    new CloudFrontWebDistribution(this, `${this.logicalId}CDN`, {
      errorConfigurations: [
        { errorCode: 403, responseCode: 404, responsePagePath: "/index.html" },
        { errorCode: 404, responseCode: 404, responsePagePath: "/index.html" },
      ],
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: storage,
            originAccessIdentity: cloudfrontIdentity,
          },
          behaviors: [
            {
              allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
              compress: true,
              defaultTtl: Duration.seconds(3600),
              forwardedValues: {
                cookies: { forward: "none" },
                queryString: false,
              },
              maxTtl: Duration.seconds(86400),
              minTtl: Duration.minutes(1),
              isDefaultBehavior: true,
            },
          ],
        },
      ],
    });

    new BucketDeployment(this, `${this.logicalId}Deploy`, {
      sources: [Source.asset("node_modules/@meal-planner/front/dist")],
      destinationBucket: storage,
    });
  }
}
