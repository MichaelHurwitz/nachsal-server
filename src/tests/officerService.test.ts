import { login, getSubordinatesByOfficerId } from "../services/officerService";
import Officer from "../models/Officer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../models/Officer", () => ({
  findOne: jest.fn(),
  findById: jest.fn(() => ({
    populate: jest.fn(),
  })),
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

beforeAll(() => {
  process.env.JWT_SECRET = "mockSecret";
});

describe("Officer Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should login an officer successfully", async () => {
      const mockOfficer = {
        _id: "officerId123",
        email: "adam.smith@example.com",
        password: "hashedPassword123",
        toObject: jest.fn().mockReturnValue({
          _id: "officerId123",
          email: "adam.smith@example.com",
        }),
      };

      (Officer.findOne as jest.Mock).mockResolvedValue(mockOfficer);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockToken");

      const result = await login({
        email: "adam.smith@example.com",
        password: "hashedPassword123",
      });

      expect(result).toEqual({
        token: "mockToken",
        officerWithoutPassword: {
          _id: "officerId123",
          email: "adam.smith@example.com",
        },
      });
    });

    it("should throw an error for invalid credentials", async () => {
      (Officer.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        login({ email: "wrong@example.com", password: "wrongPassword" })
      ).rejects.toThrow("Officer not found");
    });
  });

  describe("getSubordinatesByOfficerId", () => {
    it("should return subordinates for a valid officer ID", async () => {
      (Officer.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          subordinates: [
            { _id: "subordinate1", fullName: "Subordinate One" },
            { _id: "subordinate2", fullName: "Subordinate Two" },
          ],
        }),
      });

      const result = await getSubordinatesByOfficerId("officerId123");

      expect(result).toEqual([
        { _id: "subordinate1", fullName: "Subordinate One" },
        { _id: "subordinate2", fullName: "Subordinate Two" },
      ]);
    });

    describe("getSubordinatesByOfficerId", () => {
      it("should throw an error if no officer is found", async () => {
        (Officer.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue(null), // דימוי של קריאה שאינה מחזירה קצין
        });

        await expect(
          getSubordinatesByOfficerId("invalidOfficerId")
        ).rejects.toThrow("Officer not found");

        expect(Officer.findById).toHaveBeenCalledWith("invalidOfficerId");
      });
    });
  });
});
