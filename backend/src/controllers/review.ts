import type { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

export async function createReview(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { ustaId, rating, comment } = req.body;

  if (!ustaId || !rating || !comment) {
    return res.status(400).json({ error: 'Usta ID, baho va izoh yozilishi shart' });
  }

  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Baho 1 va 5 oralig\'ida bo\'lishi kerak' });
  }

  if (req.user.id === ustaId) {
    return res.status(400).json({ error: 'O\'zingizga sharh yozishingiz taqiqlanadi' });
  }

  try {
    // 1. Insert review into public.reviews
    // Trigger on_review_change will automatically update profiles.rating and review_count
    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        usta_id: ustaId,
        client_id: req.user.id,
        rating: numericRating,
        comment,
      })
      .select('*, client:profiles!reviews_client_id_fkey(name, avatar_url)')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Siz allaqachon ushbu ustaga sharh qoldirgansiz' });
      }
      return res.status(400).json({ error: error.message });
    }

    const formattedReview = {
      id: review.id,
      ustaId: review.usta_id,
      clientId: review.client_id,
      clientName: (review.client as any)?.name || 'Mijoz',
      clientAvatar: (review.client as any)?.avatar_url || '',
      rating: review.rating,
      comment: review.comment,
      date: review.created_at.split('T')[0],
    };

    return res.status(201).json(formattedReview);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function deleteReview(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { id } = req.params;

  try {
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: 'Sharh topilmadi' });
    }

    if (existing.client_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sizda bu sharhni o\'chirish huquqi yo\'q' });
    }

    const { error } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Sharh muvaffaqiyatli o\'chirildi' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}
