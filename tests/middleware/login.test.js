const mongoose = require("mongoose");
const request = require("supertest");
let server = require("../../server/index");
const User = require("../../server/models/user");
const login = require("../../server/middleware/login");

describe("testing the middleware function", () => {
  it("should populate the req.user", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      role: mongoose.Types.ObjectId().toHexString(),
    };
    const token = new User(user).generateToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    login(req, res, next);

    expect(req.user).toMatchObject({ roleId: user.role, userId: user._id });
    expect(next).toHaveBeenCalled();
  });

  it("should not populate the req.user if token is not provided", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      role: mongoose.Types.ObjectId().toHexString(),
    };

    const req = {
      header: jest.fn().mockReturnValue(),
    };
    const res = {};
    const next = jest.fn();

    login(req, res, next);

    expect(req.user).not.toBeDefined();
    expect(next).toBeCalled();
    expect(login(req, res, next)).toBe(next());
  });
});

describe("integration test", () => {
  beforeEach(async () => {});
  afterEach(async () => {});

  it("should return a 403 if invalid token is  provided", async () => {
    const res = await request(server)
      .get(`/api/documents/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", "outnohp8gpwtyb5n8v62nvipomtyy5874b");

    expect(res.status).toBe(401);
  });
});
