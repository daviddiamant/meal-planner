import fp from "fastify-plugin";
import puppeteer from "puppeteer-core";

const launcher = fp(async (fastify, _, done) => {
  /***
   * Start the browser, multible clients can use the same browser as long as
   * they close their pages
   **/

  const browser = await puppeteer.launch({
    executablePath: "/bin/chromium-browser",
    ignoreHTTPSErrors: true,
    args: [
      "--headless",
      "--disable-dev-shm-usage",
      "--shm-size=1gb",
      "--disable-features=PreloadMediaEngagementData,AutoplayIgnoreWebAudio, MediaEngagementBypassAutoplayPolicies",
    ],
  });

  // Make it available from the Fastify isntance
  fastify.decorate("puppeteer", browser);

  // We need to close the browser when we are done
  fastify.addHook("onClose", (instance, hookDone) => {
    instance.puppeteer.close();

    hookDone();
  });

  done();
});

export default launcher;
