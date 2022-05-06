import { Server, Socket } from "socket.io";
import data from "../db/ordersBook.json";
import { faker } from "@faker-js/faker";
import { range } from "lodash";

const generateMockOrdersBook = (): typeof data => {
  const generateOrdersData = () =>
    range(0, 4).map(() => ({
      price: faker.datatype.number(100).toString(),
      amount: faker.datatype.number(100).toString(),
      total: faker.datatype.number(100).toString(),
      weightage: faker.datatype.number({ min: 0, max: 100 }),
    }));

  return {
    tradingPair: [faker.datatype.string(3), faker.datatype.string(3)],
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

const ordersBook = (webSocketServer: Server, socket: Socket) => {
  const listOrders = (payload: any, res: (data: any) => void) => {
    res(generateMockOrdersBook());
  };
  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    /* Emit this if Data is updated Or Polling to source API */
    webSocketServer.emit(
      ordersBookMethods.listUpdated,
      generateMockOrdersBook()
    );
  }, 10000);

  socket.on(ordersBookMethods.list, listOrders);

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
};

export default ordersBook;
