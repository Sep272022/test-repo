const TABLE_NAME = "DonationTypes";
const getId = async (db, typeName) => {
  try {
    const { TypeID } = await db(TABLE_NAME)
      .where({ TypeName: typeName })
      .first();
    if (!TypeID) {
      throw new Error("Invalid typeName provided");
    }
    return TypeID;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getId,
};
