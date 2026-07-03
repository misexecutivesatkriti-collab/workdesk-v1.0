const express = require('express');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('workdesk_tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { name, dept, freq, priority, notes, sched_date, assigned_to } = req.body;
  const { data, error } = await supabase.from('workdesk_tasks').insert({
    name, dept: dept || '', freq, priority, notes,
    sched_date: sched_date || '',
    assigned_to: assigned_to || [],
    created_by: req.user.username || ''
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/:id/complete', async (req, res) => {
  const { done_remark, delay_reason } = req.body;
  const { error } = await supabase.from('workdesk_tasks').update({
    status: 'done', done_time: new Date().toISOString(),
    done_remark, delay_reason
  }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('workdesk_tasks').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
