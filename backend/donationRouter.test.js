const request = require("supertest");
const express = require("express");
const donationRouter = require("./donationRouter.js");

const app = express();
app.use(express.json());
app.use(donationRouter);

const VALID_DONATION_REQUEST = {
  name: "John Doe",
  type: "Food",
  quantity: 10,
  date: "2020-01-01",
};

const INVALID_TYPE_NAME = "InvalidType";

// jest.mock("./donationRouter", () => {
//   const originalModule = jest.requireActual("./donationRouter");
//   return {
//     ...originalModule,
//     knex: () => mockDb,
//   };
// });

// const mockDb = {
//   select: jest.fn().mockReturnThis(),
//   from: jest.fn().mockReturnThis(),
//   where: jest.fn().mockReturnThis(),
//   first: jest.fn().mockReturnThis(),
//   insert: jest.fn().mockReturnThis(),
// };

const VALID_DISTRIBUTION_LOGS = [
  {
    logID: 1,
    type: "Food",
    quantity: 10,
    date: "2020-01-01",
  },
  {
    logID: 2,
    type: "Clothing",
    quantity: 20,
    date: "2020-01-02",
  },
];

describe("Donation Server", () => {
  describe("POST /donate", () => {
    describe("when the request is invalid", () => {
      it("should return a 400 error code for missing name", async () => {
        const donationRequestWithoutName = { ...VALID_DONATION_REQUEST };
        delete donationRequestWithoutName.name;
        const response = await request(app)
          .post("/donate")
          .send(donationRequestWithoutName);
        expect(response.statusCode).toBe(400);
      });

      it("should return a 400 error code for missing type", async () => {
        const donationRequestWithoutType = { ...VALID_DONATION_REQUEST };
        delete donationRequestWithoutType.type;
        const response = await request(app)
          .post("/donate")
          .send(donationRequestWithoutType);
        expect(response.statusCode).toBe(400);
      });

      it("should return a 400 error code for invalid type", async () => {
        const donationRequestWithInvalidType = {
          ...VALID_DONATION_REQUEST,
          type: INVALID_TYPE_NAME,
        };
        const response = await request(app)
          .post("/donate")
          .send(donationRequestWithInvalidType);
        expect(response.statusCode).toBe(400);
      });

      it("should return a 400 error code for missing quantity", async () => {
        const donationRequestWithoutQuantity = { ...VALID_DONATION_REQUEST };
        delete donationRequestWithoutQuantity.quantity;
        const response = await request(app)
          .post("/donate")
          .send(donationRequestWithoutQuantity);
        expect(response.statusCode).toBe(400);
      });

      it("should return a 400 error code for invalid quantity, non-numeric value", async () => {
        const donationRequestWithInvalidQuantity = {
          ...VALID_DONATION_REQUEST,
          quantity: "invalid",
        };
        const response = await request(app)
          .post("/donate")
          .send(donationRequestWithInvalidQuantity);
        expect(response.statusCode).toBe(400);
      });

      it("should return a 400 error code for invalid quantity, negative value", async () => {
        const donationRequestWithInvalidQuantity = {
          ...VALID_DONATION_REQUEST,
          quantity: -1,
        };
        const response = await request(app)
          .post("/donate")
          .send(donationRequestWithInvalidQuantity);
        expect(response.statusCode).toBe(400);
      });

      it("should return a 400 error code for missing date", async () => {
        const donationRequestWithoutDate = { ...VALID_DONATION_REQUEST };
        delete donationRequestWithoutDate.date;
        const response = await request(app)
          .post("/donate")
          .send(donationRequestWithoutDate);
        expect(response.statusCode).toBe(400);
      });
    });
  });

  describe("GET /distributions", () => {
    it("should return a 200 status code", async () => {
      const response = await request(app).get("/distributions");
      expect(response.statusCode).toBe(200);
    });

    it("should return a list of distributions", async () => {
      // TODO: find a way to mock the database
      const response = await request(app).get("/distributions");
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            logID: expect.any(Number),
            type: expect.any(String),
            quantity: expect.any(Number),
            date: expect.any(String),
          }),
        ])
      );
    });
  });
});
