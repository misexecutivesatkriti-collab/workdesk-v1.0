const express = require('express');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('workdesk_issues').select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { title, dept, priority, description } = req.body;
  const { data, error } = await supabase.from('workdesk_issues').insert({
    title, dept: dept || '', priority, description,
    reporter: req.user.username || ''
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/:id/resolve', async (req, res) => {
  const { resolve_remark } = req.body;
  const { error } = await supabase.from('workdesk_issues').update({
    status: 'resolved', resolved_at: new Date().toISOString(), resolve_remark
  }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('workdesk_issues').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
