import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireAuth, AuthenticatedRequest } from './auth.js';

export const profilesRouter = Router();

// Apply auth to all profile endpoints
profilesRouter.use(requireAuth);

// Get all profiles for the current user
profilesRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  const profiles = db.getProfiles(req.userId!);
  return res.json({ profiles });
});

// Get a single profile
profilesRouter.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  const profile = db.getProfileById(req.userId!, req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  return res.json({ profile });
});

// Create a new profile
profilesRouter.post('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, avatar, isKid, pin, maturityLimit } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Profile name is required' });
    }

    const newProfile = db.createProfile(req.userId!, {
      name: name.trim(),
      avatar,
      isKid: Boolean(isKid),
      pin: pin ? pin.toString() : null,
      maturityLimit: maturityLimit || (isKid ? 'PG' : 'NC-17')
    });

    return res.status(201).json({ profile: newProfile });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Update profile (name, avatar, isKid, maturityLimit, pin)
profilesRouter.put('/:id', (req: AuthenticatedRequest, res: Response) => {
  const { name, avatar, isKid, pin, maturityLimit } = req.body;
  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (avatar !== undefined) updates.avatar = avatar;
  if (isKid !== undefined) updates.isKid = Boolean(isKid);
  if (pin !== undefined) updates.pin = pin;
  if (maturityLimit !== undefined) updates.maturityLimit = maturityLimit;

  const updated = db.updateProfile(req.userId!, req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.json({ profile: updated });
});

// Delete profile
profilesRouter.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteProfile(req.userId!, req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    return res.json({ message: 'Profile deleted successfully' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Verify parental control PIN
profilesRouter.post('/:id/verify-pin', (req: AuthenticatedRequest, res: Response) => {
  const { pin } = req.body;
  const profile = db.getProfileById(req.userId!, req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  if (!profile.pin) {
    return res.json({ verified: true });
  }

  if (profile.pin === pin) {
    return res.json({ verified: true });
  } else {
    return res.status(403).json({ verified: false, error: 'Incorrect PIN' });
  }
});

// Toggle Watchlist
profilesRouter.post('/:id/watchlist', (req: AuthenticatedRequest, res: Response) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ error: 'movieId is required' });
  }

  const result = db.toggleWatchlist(req.userId!, req.params.id, Number(movieId));
  if (!result) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.json(result);
});

// Set Rating (like, dislike, none)
profilesRouter.post('/:id/rating', (req: AuthenticatedRequest, res: Response) => {
  const { movieId, rating } = req.body;
  if (!movieId || !rating) {
    return res.status(400).json({ error: 'movieId and rating are required' });
  }

  const updated = db.setRating(req.userId!, req.params.id, Number(movieId), rating);
  if (!updated) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.json({ likes: updated.likes, dislikes: updated.dislikes });
});

// Record watch progress
profilesRouter.post('/:id/history', (req: AuthenticatedRequest, res: Response) => {
  const { movieId, progress } = req.body;
  if (!movieId) {
    return res.status(400).json({ error: 'movieId is required' });
  }

  const updated = db.recordWatchProgress(req.userId!, req.params.id, Number(movieId), progress || 100);
  if (!updated) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.json({ history: updated.history });
});

// Update Viewing Preferences
profilesRouter.put('/:id/preferences', (req: AuthenticatedRequest, res: Response) => {
  const { preferredGenres, preferredLanguages, streamingPlatforms, autoplayTrailers, autoplayNext } = req.body;
  const profile = db.getProfileById(req.userId!, req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  const newPreferences = {
    ...profile.preferences,
    ...(preferredGenres ? { preferredGenres } : {}),
    ...(preferredLanguages ? { preferredLanguages } : {}),
    ...(streamingPlatforms ? { streamingPlatforms } : {}),
    ...(autoplayTrailers !== undefined ? { autoplayTrailers } : {}),
    ...(autoplayNext !== undefined ? { autoplayNext } : {})
  };

  const updated = db.updateProfile(req.userId!, req.params.id, { preferences: newPreferences });
  return res.json({ preferences: updated!.preferences });
});
