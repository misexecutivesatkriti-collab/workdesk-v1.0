const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('workdesk_admins').select('id, name, username, email, role, perms, created_at')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { name, username, password, email, role, perms } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const { data, error } = await supabase.from('workdesk_admins').insert({
    name: name || username, username, password: hash, email, role: role || 'admin', perms: perms || []
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/:id/permissions', async (req, res) => {
  const { perms } = req.body;
  const { error } = await supabase.from('workdesk_admins').update({ perms }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  await supabase.from('workdesk_admins').delete().eq('id', req.params.id);
  res.json({ success: true });
});

module.exports = router;
