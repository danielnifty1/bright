import { app, server as appServer } from "./app";
import User from "./model/User";

import "reflect-metadata";
import { appendFileSync } from "fs";
import { exit } from "process";
import { Roles } from "./types/roles";
import endpoint from "./config/endpoints.config";

const port = app.get("port");
const mode = app.get("enviroment");

const server = (): void => {
  const myApp = appServer.listen(port || 5000, "0.0.0.0", async () => {
    console.log(`server running on port ${port} in mode ${mode}`.blue);
    try {
      const isAdmin = await User.findOne({ role: Roles.SUPER })
      if (!isAdmin) {
        const admin = new User({
          password: endpoint.adminPassword,
          email: endpoint.adminEmail,
          first_name: "super-admin",
          last_name: "admin",
          role: Roles.SUPER,
        });

        await admin.save();
        console.log(admin);
      }
    } catch (error: any) {
      // write error to file
      appendFileSync(
        "error.txt",
        `\n Error: ${new Date(Date.now())} ${error.message}`
      );
    }
  });

  process.on("unhandledRejection", function (reason: Error) {
    // write error to file
    appendFileSync(
      "error.txt",
      `\n Error: ${new Date(Date.now())} ${reason.message}`
    );

    if (reason.message.startsWith("querySrv ESERVFAIL _mongodb._tcp")) {
      myApp.close(() => {
        console.log((reason.name + ":", reason.message).underline.red);
        console.log("server closed".red);

        exit(1);
      });
    } else {
      console.log(reason.message.red);
    }
  });
};

server();
