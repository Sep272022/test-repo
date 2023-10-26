const DonationService = require("../../services/donationService");
const DonationTypeService = require("../../services/donationTypeService");
const DonorService = require("../../services/donorService");

describe("DonationService", () => {
  const mockDb = {
    insert: jest.fn().mockReturnValue([1]),
  };

  it("adds donation correctly with donor already in the db", async () => {
    const donation = {
      name: "John Doe",
      type: "Food",
      quantity: 5,
      date: "2020-01-01",
    };
    DonationTypeService.getId = jest.fn().mockReturnValue(1);
    DonorService.getDonatorId = jest.fn().mockReturnValue(1);

    const db = (tableName) => mockDb;
    await DonationService.makeDonation(db, donation);

    expect(mockDb.insert).toHaveBeenCalledWith({
      TypeID: 1,
      DonatorId: 1,
      Quantity: 5,
      DonationDate: "2020-01-01",
    });
  });

  it("adds donation correctly with donor not in the db", async () => {
    const donation = {
      name: "John Doe",
      type: "Clothing",
      quantity: 5,
      date: "2020-01-01",
    };
    DonationTypeService.getId = jest.fn().mockReturnValue(1);
    DonorService.addDonator = jest.fn().mockReturnValue(1);
    DonorService.getDonatorId = jest
      .fn()
      .mockReturnValue(DonorService.addDonator);

    const db = (tableName) => mockDb;
    await DonationService.makeDonation(db, donation);

    expect(mockDb.insert).toHaveBeenCalledWith({
      TypeID: 1,
      DonatorId: 1,
      Quantity: 5,
      DonationDate: "2020-01-01",
    });
  });

  it("fails to add donation with invalid type", async () => {
    const donation = {
      name: "John Doe",
      type: "Invalid",
      quantity: 5,
      date: "2020-01-01",
    };
    DonationTypeService.getId = jest.fn().mockImplementation(() => {
      throw new Error("Invalid typeName provided");
    });
    DonorService.getDonatorId = jest.fn().mockReturnValue(1);

    const db = (tableName) => mockDb;
    await expect(DonationService.makeDonation(db, donation)).rejects.toThrow(
      "Invalid typeName provided"
    );
  });
});
