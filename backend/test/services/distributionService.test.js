const DistributionService = require("../../services/distributionService");

describe("DistributionService", () => {
  it("fetches distributions correctly", async () => {
    const mockDb = {
      join: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnValue([
        {
          LogID: 1,
          TypeName: "Food",
          Quantity: 5,
          DateDistributed: "2020-01-01",
        },
        {
          LogID: 2,
          TypeName: "Clothing",
          Quantity: 10,
          DateDistributed: "2020-01-02",
        },
        {
          LogID: 3,
          TypeName: "Other",
          Quantity: 15,
          DateDistributed: "2020-01-03",
        },
        {
          LogID: 4,
          TypeName: "Food",
          Quantity: 20,
          DateDistributed: "2020-01-04",
        },
      ]),
    };

    const db = (tableName) => mockDb;
    const response = await DistributionService.fetchDistributions(db);

    expect(response).toEqual([
      {
        id: 1,
        type: "Food",
        quantity: 5,
        date: "2020-01-01",
      },
      {
        id: 2,
        type: "Clothing",
        quantity: 10,
        date: "2020-01-02",
      },
      {
        id: 3,
        type: "Other",
        quantity: 15,
        date: "2020-01-03",
      },
      {
        id: 4,
        type: "Food",
        quantity: 20,
        date: "2020-01-04",
      },
    ]);
  });

  it("fetches distributions correctly with no data", async () => {
    const mockDb = {
      join: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnValue([]),
    };

    const db = (tableName) => mockDb;
    const response = await DistributionService.fetchDistributions(db);

    expect(response).toEqual([]);
  });

  it("should throw an error if db throws an error", async () => {
    const mockDb = {
      join: jest.fn().mockReturnThis(),
      select: jest.fn().mockImplementation(() => {
        throw new Error("Database error");
      }),
    };

    const db = (tableName) => mockDb;
    await expect(
      DistributionService.fetchDistributions(db)
    ).rejects.toThrowError("Database error");
  });
});
