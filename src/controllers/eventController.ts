import { Request, Response } from "express";
import { Event } from "../models/event";

let events: Event[] = [];

export const addEvent = (req: Request, res: Response) => {
  const newEvent: Event = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
};

export const updateEvent = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) return res.status(404).json({ message: "Event not found" });

  events[index] = { ...events[index], ...req.body, updatedAt: new Date() };
  res.json(events[index]);
};

export const deleteEvent = (req: Request, res: Response) => {
  const { id } = req.params;
  events = events.filter((event) => event.id !== id);
  res.status(204).send();
};

export const getEventById = (req: Request, res: Response) => {
  const { id } = req.params;
  const event = events.find((event) => event.id === id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const listEvents = (req: Request, res: Response) => {
  const { eventName, organizer, dateFrom, dateTo } = req.query;
  let filteredEvents = events;

  if (eventName)
    filteredEvents = filteredEvents.filter((event) =>
      event.eventName.includes(eventName as string)
    );
  if (organizer)
    filteredEvents = filteredEvents.filter((event) =>
      event.organizer.includes(organizer as string)
    );
  if (dateFrom)
    filteredEvents = filteredEvents.filter(
      (event) => new Date(event.eventDate) >= new Date(dateFrom as string)
    );
  if (dateTo)
    filteredEvents = filteredEvents.filter(
      (event) => new Date(event.eventDate) <= new Date(dateTo as string)
    );

  res.json(filteredEvents);
};
