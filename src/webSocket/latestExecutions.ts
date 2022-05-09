import { Server, Socket } from "socket.io";
import data from "../db/latestExecutions.json";
import { faker } from "@faker-js/faker";
import { range } from "lodash";

type TLatestExecutionsPayload = {
  tradingPair: string[];
};

const generateMockLatestExecutions = (
  payload: TLatestExecutionsPayload
): typeof data => {
  const generateOrdersData = () =>
    range(0, 6).map((idx) => ({
      time: faker.date.recent().toLocaleTimeString("en-us"),
      executedPrice: {
        value: faker.datatype
          .number({
            min: 100,
            precision: 0.1,
          })
          .toString(),
        isPositive: faker.datatype.boolean(),
      },
      volume: faker.datatype.number({ max: 5, precision: 0.001 }).toString(),
    }));

  return {
    tradingPair: payload.tradingPair,
    tableBodyData: generateOrdersData(),
  };
};

const latestExecutionsMethods = {
  list: "latestExecutions:list",
  listUpdated: "latestExecutions:listUpdated",
};

let interval: NodeJS.Timer;
const UPDATE_INTERVAL = 10000; /* ms */

const latestExecutions = (webSocketServer: Server, socket: Socket) => {
  const listOrders = (
    payload: TLatestExecutionsPayload,
    res: (data: any) => void
  ) => {
    res(generateMockLatestExecutions(payload));
    if (interval) clearInterval(interval);

    interval = setInterval(() => {
      /* Emit this if Data is updated Or Polling to source API */
      webSocketServer.emit(
        latestExecutionsMethods.listUpdated,
        generateMockLatestExecutions(payload)
      );
    }, UPDATE_INTERVAL);
  };

  socket.on(latestExecutionsMethods.list, listOrders);

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
};

export default latestExecutions;
