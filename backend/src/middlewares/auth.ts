import type { Request, Response, NextFunction } from 'express';
import { supabaseDefault, supabaseAdmin } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Avtorizatsiya tokeni topilmadi yoki xato' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseDefault.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Yaroqsiz yoki muddati o\'tgan avtorizatsiya tokeni' });
    }

    // Fetch user role from public.profiles
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      role: profile?.role || 'client',
    };

    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server xatoligi (Auth middleware)' });
  }
}

export async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Taqiqlangan. Faqat adminlar kirishi mumkin' });
    }
    next();
  });
}
