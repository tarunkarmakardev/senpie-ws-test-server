import { TNodeEnv } from "./types";
import env from "./env";

const getEnv = () => {
  const { NODE_ENV } = process.env;
  switch (NODE_ENV as TNodeEnv) {
    case "development": {
      return env.dev;
    }

    case "production": {
      return env.prod;
    }

    default:
      return env.dev;
  }
};

export default getEnv;
