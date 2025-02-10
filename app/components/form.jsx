import React from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const Form = ({ open, handleClose, name, setName, status, setStatus, billPrice, setBillPrice, handleAddCustomer, handleUpdateCustomer, editingCustomer }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editingCustomer ? 'Update Customer' : 'Create a Customer'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Unpaid">Unpaid</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Bill Price"
          fullWidth
          type="number"
          value={billPrice}
          onChange={(e) => setBillPrice(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer} variant="contained" color="primary">
          {editingCustomer ? 'Update' : 'Add Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Form;