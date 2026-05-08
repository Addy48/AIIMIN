/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aiimin-backend",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // 1. Storage - S3 Bucket (STANDARD class is default)
    const resumeBucket = new sst.aws.Bucket("Resumes", {
      cors: [
        {
          allowHeaders: ["*"],
          allowMethods: ["PUT", "GET"],
          allowOrigins: ["*"], // Restrict to front-end domains in production
        },
      ],
    });

    // 2. Main API & Lambda Execution
    const api = new sst.aws.ApiGatewayV2("Api");
    api.route("$default", {
      handler: "index.handler",
      link: [resumeBucket],
      environment: {
        DATABASE_URL: process.env.DATABASE_URL || "", // Neon Pooled URL
        SUPABASE_URL: process.env.SUPABASE_URL || "",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY || "",
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
        AWS_S3_BUCKET_NAME: resumeBucket.name,
      },
      timeout: "20 seconds",
    });

    // 3. Cron Task - Refresh sports cache every 5 minutes
    new sst.aws.Cron("SportsCron", {
      schedule: "rate(5 minutes)",
      function: {
        handler: "jobs/sportsFetcher.handler",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL || "",
        },
        timeout: "60 seconds",
      },
    });

    return {
      ApiUrl: api.url,
      BucketName: resumeBucket.name,
    };
  },
});

