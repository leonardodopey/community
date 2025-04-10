import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getEvent = async (req: any, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      omit: { userId: true, createdAt: true },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json("something went wrong");
  }
};
export const getSingleEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      omit: { userId: true, createdAt: true },
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json("something went wrong");
  }
};
export const getMyEvents = async (req: any, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        userId: req.user.userId,
      },
    });
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json("something went wrong");
  }
};

export const createEvent = async (req: any, res: Response) => {
  const { title, description, location, event_date } = req.body;
  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        event_date: new Date(event_date),
        userId: req.user.userId,
      },
    });
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to create event", details: error });
  }
};

export const updateEvent = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, description, location, event_date } = req.body;

  try {
    const event = await prisma.event.updateMany({
      where: { id, userId: req.user.userId },
      data: { title, description, location, event_date: new Date(event_date) },
    });

    if (event.count === 0)
      res.status(404).json({ error: "Event not found or unauthorized" });

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to update event" });
  }
};

export const deleteEvent = async (req: any, res: Response) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.deleteMany({
      where: { id, userId: req.user.userId },
    });

    if (event.count === 0)
      res.status(404).json({ error: "Event not found or unauthorized" });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete event" });
  }
};
