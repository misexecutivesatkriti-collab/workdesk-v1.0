const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('workdesk_employees').select('id, name, username, designation, email, dept, created_at')
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { name, username, password, dept, designation, email } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const { data, error } = await supabase.from('workdesk_employees').insert({
    name, username, password: hash,
    dept: dept || '',
    designation, email
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('workdesk_employees').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
