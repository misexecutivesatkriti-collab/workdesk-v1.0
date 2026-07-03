const express = require('express');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('workdesk_trash').select('*').order('deleted_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

router.post('/restore/:type/:id', async (req, res) => {
  const { error } = await supabase.from('workdesk_trash').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/permanent/:type/:id', async (req, res) => {
  const { error } = await supabase.from('workdesk_trash').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/clear-all', async (req, res) => {
  const { error } = await supabase.from('workdesk_trash').delete().neq('id', '');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
