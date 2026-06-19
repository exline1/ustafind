import type { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

export async function createService(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  // Only approved or pending ustas and admins can create services
  if (!['usta_approved', 'usta_pending', 'admin'].includes(req.user.role || '')) {
    return res.status(403).json({ error: 'Faqat ustalar xizmat qo\'sha oladi' });
  }

  const { name, price, description, duration } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Xizmat nomi va narxi kiritilishi shart' });
  }

  try {
    const { data: service, error } = await supabaseAdmin
      .from('services')
      .insert({
        usta_id: req.user.id,
        name,
        price: Number(price),
        description,
        duration,
      })
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(service);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function updateService(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { id } = req.params;
  const updates = req.body;

  // Protect usta_id from updates
  delete updates.usta_id;
  delete updates.created_at;

  try {
    // 1. Fetch service to check ownership
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: 'Xizmat topilmadi' });
    }

    if (existing.usta_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sizda bu xizmatni tahrirlash huquqi yo\'q' });
    }

    // 2. Update service
    const { data: service, error } = await supabaseAdmin
      .from('services')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(service);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function deleteService(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { id } = req.params;

  try {
    // 1. Fetch service to check ownership
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: 'Xizmat topilmadi' });
    }

    if (existing.usta_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sizda bu xizmatni o\'chirish huquqi yo\'q' });
    }

    // 2. Delete service
    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Xizmat o\'chirildi' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}
