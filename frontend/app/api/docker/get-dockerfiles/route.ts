import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");
    const userId = searchParams.get("userId");

    // If no adminId and userId provided, return empty
    if (!adminId && !userId) {
      return NextResponse.json(
        { error: "adminId or userId is required" },
        { status: 400 }
      );
    }

    // Get Dockerfiles from the database
    // You'll need to create a Dockerfile model in your Prisma schema
    // For now, returning mock data until you set up the schema
    const dockerfiles = [
      {
        id: 1,
        name: "Node.js App",
        content: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
        createdAt: new Date("2024-11-10"),
      },
      {
        id: 2,
        name: "Python Flask",
        content: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]`,
        createdAt: new Date("2024-11-11"),
      },
    ];

    return NextResponse.json({
      success: true,
      data: dockerfiles,
    });
  } catch (error) {
    console.error("Get Dockerfiles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Dockerfiles" },
      { status: 500 }
    );
  }
}
