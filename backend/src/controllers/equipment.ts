import type { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

export async function getEquipments(req: Request, res: Response) {
  const { category, city, query } = req.query;

  try {
    let dbQuery = supabaseAdmin
      .from('equipments')
      .select(`
        *,
        owner:profiles!equipments_owner_id_fkey(name, rating)
      `);

    if (category) {
      dbQuery = dbQuery.ilike('category', `%${category}%`);
    }

    if (city) {
      dbQuery = dbQuery.ilike('city', `%${city}%`);
    }

    const { data: equipments, error } = await dbQuery;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    let filtered = equipments || [];

    // Filter using textual search query if exists
    if (query) {
      const q = String(query).toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }

    const formatted = filtered.map(e => ({
      id: e.id,
      ownerId: e.owner_id,
      ownerName: (e.owner as any)?.name || 'Ega',
      ownerRating: (e.owner as any)?.rating || 0.0,
      name: e.name,
      category: e.category,
      description: e.description,
      specs: e.specs,
      dailyPrice: e.daily_price,
      weeklyPrice: e.weekly_price,
      city: e.city,
      district: e.district,
      images: e.images,
      available: e.available,
      createdAt: e.created_at,
    }));

    return res.status(200).json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function getEquipmentById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const { data: e, error } = await supabaseAdmin
      .from('equipments')
      .select(`
        *,
        owner:profiles!equipments_owner_id_fkey(name, rating, phone, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error || !e) {
      return res.status(404).json({ error: 'Texnika topilmadi' });
    }

    const formatted = {
      id: e.id,
      ownerId: e.owner_id,
      ownerName: (e.owner as any)?.name || 'Ega',
      ownerRating: (e.owner as any)?.rating || 0.0,
      ownerPhone: (e.owner as any)?.phone || '',
      ownerAvatar: (e.owner as any)?.avatar_url || '',
      name: e.name,
      category: e.category,
      description: e.description,
      specs: e.specs,
      dailyPrice: e.daily_price,
      weeklyPrice: e.weekly_price,
      city: e.city,
      district: e.district,
      images: e.images,
      available: e.available,
      createdAt: e.created_at,
    };

    return res.status(200).json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function createEquipment(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { name, category, description, specs, dailyPrice, weeklyPrice, city, district, images } = req.body;

  if (!name || !category || !description || !dailyPrice || !city) {
    return res.status(400).json({ error: 'Barcha majburiy maydonlar kiritilishi shart' });
  }

  try {
    const { data: equipment, error } = await supabaseAdmin
      .from('equipments')
      .insert({
        owner_id: req.user.id,
        name,
        category,
        description,
        specs: specs || {},
        daily_price: Number(dailyPrice),
        weekly_price: weeklyPrice ? Number(weeklyPrice) : null,
        city,
        district,
        images: images || [],
        available: true,
      })
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(equipment);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function updateEquipment(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { id } = req.params;
  const updates = req.body;

  delete updates.owner_id;
  delete updates.created_at;

  try {
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('equipments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: 'Texnika topilmadi' });
    }

    if (existing.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sizda bu texnikani tahrirlash huquqi yo\'q' });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('equipments')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function deleteEquipment(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { id } = req.params;

  try {
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('equipments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: 'Texnika topilmadi' });
    }

    if (existing.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sizda bu texnikani o\'chirish huquqi yo\'q' });
    }

    const { error } = await supabaseAdmin
      .from('equipments')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Texnika muvaffaqiyatli o\'chirildi' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

// Renting flow
export async function rentEquipment(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { id } = req.params;
  const { startDate, endDate, totalPrice } = req.body;

  if (!startDate || !endDate || !totalPrice) {
    return res.status(400).json({ error: 'Sana va umumiy narx kiritilishi shart' });
  }

  try {
    const { data: equipment, error: fetchErr } = await supabaseAdmin
      .from('equipments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !equipment) {
      return res.status(404).json({ error: 'Texnika topilmadi' });
    }

    if (!equipment.available) {
      return res.status(400).json({ error: 'Ushbu texnika hozirda ijarada' });
    }

    if (equipment.owner_id === req.user.id) {
      return res.status(400).json({ error: 'O\'z texnikangizni ijara qila olmaysiz' });
    }

    // 1. Create rental booking
    const { data: rental, error } = await supabaseAdmin
      .from('equipment_rentals')
      .insert({
        equipment_id: id,
        renter_id: req.user.id,
        start_date: startDate,
        end_date: endDate,
        total_price: Number(totalPrice),
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(rental);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function getRentals(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  try {
    // Fetch rentals where user is renter OR owner of the equipment
    const { data: rentals, error } = await supabaseAdmin
      .from('equipment_rentals')
      .select(`
        *,
        equipment:equipments(name, owner_id),
        renter:profiles!equipment_rentals_renter_id_fkey(name)
      `);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const filtered = (rentals || []).filter(r =>
      r.renter_id === req.user?.id ||
      (r.equipment as any)?.owner_id === req.user?.id ||
      req.user?.role === 'admin'
    );

    const formatted = filtered.map(r => ({
      id: r.id,
      equipmentId: r.equipment_id,
      equipmentName: (r.equipment as any)?.name || 'Texnika',
      renterId: r.renter_id,
      renterName: (r.renter as any)?.name || 'Ijarachi',
      ownerId: (r.equipment as any)?.owner_id || '',
      startDate: r.start_date,
      endDate: r.end_date,
      totalPrice: r.total_price,
      status: r.status,
      createdAt: r.created_at,
    }));

    return res.status(200).json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function updateRentalStatus(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Yaroqsiz status' });
  }

  try {
    const { data: rental, error: fetchErr } = await supabaseAdmin
      .from('equipment_rentals')
      .select(`
        *,
        equipment:equipments(owner_id)
      `)
      .eq('id', id)
      .single();

    if (fetchErr || !rental) {
      return res.status(404).json({ error: 'Ijara buyurtmasi topilmadi' });
    }

    const ownerId = (rental.equipment as any)?.owner_id;
    const isRenter = rental.renter_id === req.user.id;
    const isOwner = ownerId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isRenter && !isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Sizda bu buyurtmani o\'zgartirish huquqi yo\'q' });
    }

    if (isRenter && status !== 'cancelled' && !isAdmin) {
      return res.status(403).json({ error: 'Ijarachilar faqat buyurtmani bekor qila oladi' });
    }

    // Update rental status
    const { data: updated, error } = await supabaseAdmin
      .from('equipment_rentals')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // If rental is confirmed, mark equipment availability to false
    if (status === 'confirmed') {
      await supabaseAdmin
        .from('equipments')
        .update({ available: false })
        .eq('id', rental.equipment_id);
    }

    // If rental is completed or cancelled, mark equipment availability to true
    if (status === 'completed' || status === 'cancelled') {
      await supabaseAdmin
        .from('equipments')
        .update({ available: true })
        .eq('id', rental.equipment_id);
    }

    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}
