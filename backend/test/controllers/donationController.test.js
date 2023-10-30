const { postDonation } = require("../../controllers/donationController");
const DonationService = require("../../services/donationService");

let mockRequest;
let mockResponse;

describe("postDonation", () => {
  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if donation request is invalid", async () => {
    await postDonation(null)(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Invalid donation request",
    });
  });

  describe("should return 400", () => {
    it("if name is not provided", async () => {
      mockRequest.body = {
        type: "food",
        quantity: 2,
        date: "2022-01-01",
      };

      await postDonation(null)(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid donation request",
      });
    });

    it("if type is not provided", async () => {
      mockRequest.body = {
        name: "John",
        quantity: 2,
        date: "2022-01-01",
      };

      await postDonation(null)(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid donation request",
      });
    });

    it("if quantity is not provided", async () => {
      mockRequest.body = {
        name: "John",
        type: "food",
        date: "2022-01-01",
      };

      await postDonation(null)(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid donation request",
      });
    });

    it("if date is not provided", async () => {
      mockRequest.body = {
        name: "John",
        type: "food",
        quantity: 2,
      };

      await postDonation(null)(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid donation request",
      });
    });
  });

  it("should make a donation and return the donationID", async () => {
    mockRequest.body = {
      name: "John",
      type: "Food",
      quantity: 2,
      date: "2022-01-01",
    };
    DonationService.makeDonation = jest
      .fn()
      .mockResolvedValue({ donationID: "1" });
    await postDonation(null)(mockRequest, mockResponse);

    expect(DonationService.makeDonation).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ donationID: "1" });
  });

  it("should return 500 if makeDonation() fails", async () => {
    mockRequest.body = {
      name: "John",
      type: "Food",
      quantity: 2,
      date: "2022-01-01",
    };
    DonationService.makeDonation = jest
      .fn()
      .mockRejectedValue(new Error("Some error"));
    await postDonation(null)(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Some error" });
  });
});
