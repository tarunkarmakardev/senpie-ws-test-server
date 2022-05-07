import { Server, Socket } from "socket.io";
import data from "../db/ordersBook.json";
import { faker } from "@faker-js/faker";
import { range } from "lodash";

type TListOrderPayload = {
  tradingPair: string[];
};

const generateMockOrdersBook = (payload: TListOrderPayload): typeof data => {
  const generateOrdersData = () =>
    range(0, 5).map(() => ({
      price: faker.datatype.number(100).toString(),
      amount: faker.datatype.number(100).toString(),
      total: faker.datatype.number(100).toString(),
      weightage: faker.datatype.number({ min: 0, max: 100 }),
    }));

  return {
    tradingPair: payload.tradingPair,
    buyOrders: {
      data: generateOrdersData(),
    },
    sellOrders: {
      data: generateOrdersData(),
    },
  };
};

const ordersBookMethods = {
  list: "ordersBook:list",
  listUpdated: "ordersBook:listUpdated",
};

let interval: NodeJS.Timer;
const UPDATE_INTERVAL = 10000; /* ms */

const ordersBook = (webSocketServer: Server, socket: Socket) => {
  const listOrders = (payload: TListOrderPayload, res: (data: any) => void) => {
    res(generateMockOrdersBook(payload));
    if (interval) clearInterval(interval);

    interval = setInterval(() => {
      /* Emit this if Data is updated Or Polling to source API */
      webSocketServer.emit(
        ordersBookMethods.listUpdated,
        generateMockOrdersBook(payload)
      );
    }, UPDATE_INTERVAL);
  };

  socket.on(ordersBookMethods.list, listOrders);

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
};

export default ordersBook;
