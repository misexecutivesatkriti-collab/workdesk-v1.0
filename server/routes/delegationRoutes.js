const express = require('express');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('workdesk_delegations').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { task_name, doer_name, priority, exp_date, notes } = req.body;
  const { data, error } = await supabase.from('workdesk_delegations').insert({
    task_name, doer_name, priority,
    exp_date: exp_date || '', notes, status: 'pending',
    created_date: new Date().toISOString()
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/:id/complete', async (req, res) => {
  const { done_remark, delay_reason } = req.body;
  const { error } = await supabase.from('workdesk_delegations').update({
    status: 'completed', actual_date: new Date().toISOString(),
    done_remark, delay_reason
  }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('workdesk_delegations').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
