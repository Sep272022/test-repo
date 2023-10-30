const request = require("supertest");
const app = require("../server");
const DonationService = require("../services/donationService");

const VALID_DONATION = {
  name: "John",
  type: "Food",
  quantity: 2,
  date: "2022-01-01",
};

describe("POST /donate", () => {
  beforeEach(() => {
    DonationService.makeDonation = jest.fn().mockReturnValue({ donationID: 1 });
  });
  describe("with valid donation", () => {
    it("should return 200 and donationID", async () => {
      const response = await request(app)
        .post("/donate")
        .send(VALID_DONATION)
        .expect(200);

      expect(response.body).toHaveProperty("donationID");
      expect(response.body.donationID).toBe(1);
    });
  });

  describe("with invalid donation", () => {
    it("should return 400 if donation request is invalid", async () => {
      await request(app)
        .post("/donate")
        .send({})
        .expect(400)
        .expect({ error: "Invalid donation request" });
    });

    it("should return 400 if name is not provided", async () => {
      const invalidDonation = { ...VALID_DONATION };
      delete invalidDonation.name;
      await request(app)
        .post("/donate")
        .send(invalidDonation)
        .expect(400)
        .expect({ error: "Invalid donation request" });
    });

    it("should return 400 if type is not provided", async () => {
      const invalidDonation = { ...VALID_DONATION };
      delete invalidDonation.type;
      await request(app)
        .post("/donate")
        .send(invalidDonation)
        .expect(400)
        .expect({ error: "Invalid donation request" });
    });

    it("should return 400 if type is invalid", async () => {
      const invalidDonation = { ...VALID_DONATION, type: "Invalid" };
      await request(app)
        .post("/donate")
        .send(invalidDonation)
        .expect(400)
        .expect({ error: "Invalid donation request" });
    });

    it("should return 400 if quantity is not provided", async () => {
      const invalidDonation = { ...VALID_DONATION };
      delete invalidDonation.quantity;
      await request(app)
        .post("/donate")
        .send(invalidDonation)
        .expect(400)
        .expect({ error: "Invalid donation request" });
    });

    it("should return 400 if quantity is negative", async () => {
      const invalidDonation = { ...VALID_DONATION, quantity: -1 };
      await request(app)
        .post("/donate")
        .send(invalidDonation)
        .expect(400)
        .expect({ error: "Invalid donation request" });
    });

    it("should return 400 if date is not provided", async () => {
      const invalidDonation = { ...VALID_DONATION };
      delete invalidDonation.date;
      await request(app)
        .post("/donate")
        .send(invalidDonation)
        .expect(400)
        .expect({ error: "Invalid donation request" });
    });
  });

  it("should return 500 if donation service throws error due to db error", async () => {
    DonationService.makeDonation = jest
      .fn()
      .mockRejectedValue(new Error("db error"));
    await request(app)
      .post("/donate")
      .send(VALID_DONATION)
      .expect(500)
      .expect({ error: "db error" });
  });
});
