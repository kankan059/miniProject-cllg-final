

import { Router } from 'express';
import { 
    getEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent 
} from '../controllers/eventControllers';

const router = Router();

// PUBLIC ACCESS ROUTES
router.get('/', getEvents);          // GET /api/events All active events
router.get('/:id', getEventById);    // Single event details

// ADMIN/ORGANIZER 
router.post('/', createEvent);        // Create new event
router.put('/:id', updateEvent);      //  Update event
router.delete('/:id', deleteEvent);   // Deletes event

export default router;