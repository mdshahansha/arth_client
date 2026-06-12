import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeColors } from '../../hooks/useThemeColors';
import { createTransaction, type CreateTransactionPayload } from '../../api/transactions.api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  { value: 'food', label: 'Food and Drinks' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'bills', label: 'Bills / Housing' },
  { value: 'travel', label: 'Transportation' },
  { value: 'entertainment', label: 'Entertainment' },
] as const;

export const AddExpenseModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const colors = useThemeColors();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CreateTransactionPayload['category']>('food');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setTitle('');
    setAmount('');
    setCategory('food');
    setType('debit');
    setDate(new Date().toISOString().slice(0, 10));
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) { setError('Enter a valid amount'); return; }

    setSaving(true);
    setError('');
    try {
      await createTransaction({
        title: title.trim(),
        amount: num,
        category,
        type,
        transaction_date: new Date(date).toISOString(),
      });
      reset();
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to add transaction');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-expense-title">
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: { xs: '92%', sm: 460 }, bgcolor: colors.cardBg, borderRadius: '20px',
        p: '32px', outline: 'none',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '24px' }}>
          <Typography id="add-expense-title" sx={{ fontSize: 22, fontWeight: 700, color: colors.textPrimary }}>
            Add Transaction
          </Typography>
          <IconButton onClick={handleClose} size="small" aria-label="Close">
            <CloseIcon sx={{ fontSize: 20, color: colors.textSecondary }} />
          </IconButton>
        </Box>

        {error && <Alert severity="error" role="alert" onClose={() => setError('')} sx={{ mb: '18px', borderRadius: '10px' }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grocery shopping" fullWidth size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <TextField label="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)}
              type="number" placeholder="0.00" fullWidth size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            <TextField label="Type" value={type} onChange={(e) => setType(e.target.value as 'debit' | 'credit')}
              select fullWidth size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
              <MenuItem value="debit">Expense (Debit)</MenuItem>
              <MenuItem value="credit">Income (Credit)</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <TextField label="Category" value={category}
              onChange={(e) => setCategory(e.target.value as CreateTransactionPayload['category'])}
              select fullWidth size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
              {categories.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
            </TextField>
            <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
              fullWidth size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', mt: '24px' }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none', color: colors.textSecondary }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}
            sx={{ textTransform: 'none', fontWeight: 700, backgroundColor: '#167AFF', '&:hover': { backgroundColor: '#1268DD' }, minWidth: 140 }}>
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Add Transaction'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
