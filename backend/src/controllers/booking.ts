import type { Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { ustaId, serviceType, date, time, address, notes, totalPrice } = req.body;

  if (!ustaId || !serviceType || !date || !time || !address || !totalPrice) {
    return res.status(400).json({ error: 'Barcha zaruriy ma\'lumotlar kiritilishi shart' });
  }

  try {
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        client_id: req.user.id,
        usta_id: ustaId,
        service_type: serviceType,
        date,
        time,
        address,
        notes,
        total_price: Number(totalPrice),
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(booking);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  try {
    let query = supabaseAdmin
      .from('bookings')
      .select(`
        *,
        client:profiles!bookings_client_id_fkey(name),
        usta:profiles!bookings_usta_id_fkey(name)
      `);

    // If admin, fetch all. Otherwise, fetch client's or usta's bookings.
    if (req.user.role !== 'admin') {
      query = query.or(`client_id.eq.${req.user.id},usta_id.eq.${req.user.id}`);
    }

    const { data: bookings, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const formattedBookings = (bookings || []).map(b => ({
      id: b.id,
      clientId: b.client_id,
      clientName: (b.client as any)?.name || 'Mijoz',
      ustaId: b.usta_id,
      ustaName: (b.usta as any)?.name || 'Usta',
      serviceType: b.service_type,
      date: b.date,
      time: b.time,
      address: b.address,
      notes: b.notes,
      status: b.status,
      totalPrice: b.total_price,
      createdAt: b.created_at,
    }));

    return res.status(200).json(formattedBookings);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}

export async function updateBookingStatus(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o\'tilmagan' });
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Yaroqsiz status' });
  }

  try {
    // 1. Fetch booking to check permissions
    const { data: booking, error: fetchErr } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !booking) {
      return res.status(404).json({ error: 'Bandlov topilmadi' });
    }

    // Permission checks:
    // Clients can cancel their bookings.
    // Ustas can confirm, complete, or cancel bookings.
    // Admins can do anything.
    const isClient = booking.client_id === req.user.id;
    const isUsta = booking.usta_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isClient && !isUsta && !isAdmin) {
      return res.status(403).json({ error: 'Sizda bu bandlovni o\'zgartirish huquqi yo\'q' });
    }

    if (isClient && status !== 'cancelled' && !isAdmin) {
      return res.status(403).json({ error: 'Mijozlar faqat bandlovni bekor qila oladi' });
    }

    // 2. Update status
    const { data: updatedBooking, error } = await supabaseAdmin
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // If usta completed the booking, increment completed_jobs in usta's profile
    if (status === 'completed' && booking.status !== 'completed') {
      const { data: ustaProfile } = await supabaseAdmin
        .from('profiles')
        .select('completed_jobs')
        .eq('id', booking.usta_id)
        .single();
      
      const currentJobs = ustaProfile?.completed_jobs || 0;
      await supabaseAdmin
        .from('profiles')
        .update({ completed_jobs: currentJobs + 1 })
        .eq('id', booking.usta_id);
    }

    return res.status(200).json(updatedBooking);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverda xatolik' });
  }
}
