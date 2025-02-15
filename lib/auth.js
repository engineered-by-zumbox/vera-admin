import { randomBytes } from "crypto"
import { sign, verify } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import dbConnect from "./db"

export async function verifyPassword(hashedPassword, plainPassword) {
  if (!hashedPassword || !plainPassword) {
    console.error("Invalid password provided for verification")
    return false
  }

  try {
    console.log("Attempting to verify password")
    console.log("Hashed password length:", hashedPassword.length)
    console.log("Plain password length:", plainPassword.length)
    const isValid = await bcrypt.compare(plainPassword, hashedPassword)
    console.log("Password verification result:", isValid)
    return isValid
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

export function generateOTP() {
  return randomBytes(3).toString("hex").toUpperCase()
}

export async function hashOTP(otp) {
  return bcrypt.hash(otp, 10)
}

export async function verifyOTP(hashedOTP, plainOTP) {
  try {
    return await bcrypt.compare(plainOTP, hashedOTP)
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return false
  }
}

export function generateToken(userId, expiresIn = "1d") {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not configured")
  }

  try {
    const payload = {
      sub: userId,
      userId: userId,
    }

    const token = sign(payload, secret, { expiresIn })
    return token
  } catch (error) {
    console.error("Token generation error:", error)
    throw error
  }
}

export function verifyToken(token) {
  if (!token) {
    console.error("No token provided for verification")
    return null
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error("JWT_SECRET is not configured")
    }

    const decoded = verify(token, secret)
    console.log("Token verified successfully:", decoded)
    return decoded
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function getUserFromToken(token) {
  console.log("Getting user from token:", token?.substring(0, 10) + "...")

  const payload = verifyToken(token)
  if (!payload) {
    console.log("No valid payload from token")
    return null
  }

  try {
    await dbConnect()
    const user = await User.findById(payload.userId).select("id email")
    console.log("User retrieved from token:", user?._id)
    return user
  } catch (error) {
    console.error("Error fetching user from token:", error)
    return null
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

