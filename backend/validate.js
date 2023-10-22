/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const Ajv = require("ajv");
const ajv = new Ajv();
const donationTypes = require("./donationTypes");

const donationRequestSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    type: { type: "string", enum: donationTypes },
    quantity: { type: "number", minimum: 0 },
    date: { type: "string" },
  },
  required: ["name", "type", "quantity", "date"],
  additionalProperties: false,
};
const donationRequestValidator = ajv.compile(donationRequestSchema);

module.exports = { donationRequestValidator };
