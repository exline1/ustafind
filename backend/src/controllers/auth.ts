import type { Response } from 'express';
import { supabaseDefault, supabaseAdmin } from '../config/supabase.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

export async function signup(req: AuthenticatedRequest, res: Response) {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Ism, email va parol kiritilishi shart' });
  }

  try {
    const { data, error } = await supabaseDefault.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(400).json({ error: 'Ro\'yxatdan o\'tishda xatolik yuz berdi' });
    }

    // Return session and user profile
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return res.status(201).json({
      session: data.session,
      user: profile || {
        id: data.user.id,
        email: data.user.email,
        name,
        role: 'client',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function login(req: AuthenticatedRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email va parol kiritilishi shart' });
  }

  try {
    const { data, error } = await supabaseDefault.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(400).json({ error: 'Tizimga kirishda xatolik yuz berdi' });
    }

    // Get user profile
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return res.status(200).json({
      session: data.session,
      user: profile || {
        id: data.user.id,
        email: data.user.email,
        role: 'client',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Foydalanuvchi profili topilmadi' });
    }

    return res.status(200).json({ user: profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const updates = req.body;
  
  // Protect id and email from updates
  delete updates.id;
  delete updates.email;
  delete updates.registered_at;

  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
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

export async function selectRole(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { role } = req.body;

  if (!role || !['client', 'usta_pending'].includes(role)) {
    return res.status(400).json({ error: 'Noto\'g\'ri rol tanlandi' });
  }

  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', req.user.id)
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

export async function getAllUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(profiles);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

