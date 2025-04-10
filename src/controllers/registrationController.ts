import { Request, Response } from "express";
import { prisma } from "../config/prisma";
export const registerToEvent = async (req: Request | any, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user?.userId;

    const isAlreadyRegistered = await prisma.registration.findFirst({
      where: {
        userId,
        eventId,
      },
    });
    if (isAlreadyRegistered) {
      res.status(203).json({ message: "Already Exists" });
      return;
    }

    const result = await prisma.registration.create({
      data: {
        eventId,
        userId,
      },
    });

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json("something went wrong");
  }
};

export const getMyEventRegistrations = async (req: any, res: Response) => {
  const eventId = req.params.eventId;
  const userId = req.user.userId;
  try {
    const registrations = await prisma.event.findMany({
      where: {
        id: eventId,
        userId,
      },
      select: {
        Registration: true,
      },
    });
    res.json(registrations).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Error" });
  }
};

export const getVolunteerRegistrations = async (req: any, res: Response) => {
  const userId = req.user.userId;
  console.log(userId);
  try {
    const registrations = await prisma.registration.findMany({
      where: { userId },
      select: {
        event: true,
      },
    });
    res.json(registrations).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Error" });
  }
};
