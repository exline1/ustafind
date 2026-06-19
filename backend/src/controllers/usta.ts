import type { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export async function getUstalar(req: Request, res: Response) {
  const { category, city, query } = req.query;

  try {
    let dbQuery = supabaseAdmin
      .from('profiles')
      .select('*')
      .in('role', ['usta_approved']); // Only fetch approved ustas

    if (category) {
      dbQuery = dbQuery.ilike('category', `%${category}%`);
    }

    if (city) {
      dbQuery = dbQuery.ilike('city', `%${city}%`);
    }

    const { data: ustalar, error } = await dbQuery;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    let filtered = ustalar || [];

    // Simple text search if query is provided
    if (query) {
      const q = String(query).toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(q) ||
        (u.category && u.category.toLowerCase().includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q)) ||
        (u.skills && u.skills.some((s: string) => s.toLowerCase().includes(q)))
      );
    }

    return res.status(200).json(filtered);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function getUstaById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    // 1. Fetch usta profile
    const { data: usta, error: ustaErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (ustaErr || !usta) {
      return res.status(404).json({ error: 'Usta topilmadi' });
    }

    // 2. Fetch services for this usta
    const { data: services, error: servicesErr } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('usta_id', id);

    // 3. Fetch reviews for this usta
    const { data: reviews, error: reviewsErr } = await supabaseAdmin
      .from('reviews')
      .select('*, client:profiles!reviews_client_id_fkey(name, avatar_url)')
      .eq('usta_id', id);

    const fullUsta = {
      ...usta,
      services: services || [],
      reviews: reviews ? reviews.map(r => ({
        id: r.id,
        ustaId: r.usta_id,
        clientId: r.client_id,
        clientName: (r.client as any)?.name || 'Mijoz',
        clientAvatar: (r.client as any)?.avatar_url || '',
        rating: r.rating,
        comment: r.comment,
        date: r.created_at.split('T')[0],
      })) : [],
    };

    return res.status(200).json(fullUsta);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

// Admin / Moderator endpoint to approve a pending usta
export async function approveUsta(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'usta_approved', is_verified: true })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ user: profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

// Admin / Moderator endpoint to reject/demote a usta to client
export async function rejectUsta(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'client', is_verified: false })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ user: profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}
