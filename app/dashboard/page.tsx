'use client'

import { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar } from '@mui/material';
import Form from '@/app/components/form';

interface Customer {
  id: number;
  name: string;
  status: string;
  billPrice: string;
}

export default function Page() {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [status, setStatus] = useState<string>('Active');
  const [billPrice, setBillPrice] = useState<string>('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [message, setMessage] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customerdata');
        const data = await response.json();
        if (response.ok) {
          setCustomers(data.map((customer: any) => ({
            id: customer.id,
            name: customer.name,
            status: customer.status ? 'Paid' : 'Unpaid',
            billPrice: `$${customer.price}`
          })));
        } else {
          setMessage('Failed to fetch customers.');
          setOpenSnackbar(true);
        }
      } catch (error: any) {
        setMessage('Error: ' + error.message);
        setOpenSnackbar(true);
      } finally {
        setIsLoading(false); // Set loading to false when done
      }
    };

    fetchCustomers();
  }, []);

  const handleClickOpen = () => {
    setEditingCustomer(null);
    setName('');
    setStatus('Active');
    setBillPrice('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAddCustomer = async () => {
    if (name && billPrice) {
      const customerData = {
        name,
        status: status === 'Active',
        billPrice: parseFloat(billPrice),
      };

      try {
        const response = await fetch('/api/customerdata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData),
        });

        const data = await response.json();

        if (response.ok) {
          setCustomers([
            ...customers,
            { id: data.id, name, status, billPrice: `$${billPrice}` },
          ]);
          setMessage('Customer added successfully!');
        } else {
          setMessage(data.message || 'Failed to add customer.');
        }
      } catch (error: any) {
        setMessage('Error: ' + error.message);
      }

      setName('');
      setStatus('Active');
      setBillPrice('');
      handleClose();
      setOpenSnackbar(true);
    }
  };

  const handleUpdateCustomer = async () => {
    if (editingCustomer && name && billPrice) {
      const customerData = {
        id: editingCustomer.id,
        name,
        status: status === 'Active',
        billPrice: parseFloat(billPrice),
      };

      try {
        const response = await fetch('/api/customerdata', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData),
        });

        const data = await response.json();

        if (response.ok) {
          setCustomers(customers.map(customer =>
            customer.id === editingCustomer.id ? { ...customer, name, status, billPrice: `$${billPrice}` } : customer
          ));
          setMessage('Customer updated successfully!');
        } else {
          setMessage(data.message || 'Failed to update customer.');
        }
      } catch (error: any) {
        setMessage('Error: ' + error.message);
      }

      setName('');
      setStatus('Active');
      setBillPrice('');
      handleClose();
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/customerdata`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        setCustomers(customers.filter(customer => customer.id !== id));
        setMessage('Customer deleted successfully!');
      } else {
        setMessage(data.message || 'Failed to delete customer.');
      }
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
    setOpenSnackbar(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setStatus(customer.status);
    setBillPrice(customer.billPrice.replace('$', ''));
    setOpen(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className='text-3xl font-bold m-10'>All customer Records</h1>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New Customer+
      </Button>

      <Form
        open={open}
        handleClose={handleClose}
        name={name}
        setName={setName}
        status={status}
        setStatus={setStatus}
        billPrice={billPrice}
        setBillPrice={setBillPrice}
        handleAddCustomer={handleAddCustomer}
        handleUpdateCustomer={handleUpdateCustomer}
        editingCustomer={editingCustomer}
      />

      <TableContainer component={Paper} className="mt-6 w-full max-w-2xl">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Bill Price</TableCell>
              <TableCell>Update Records</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? ( // Show loading text if isLoading is true
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>{customer.billPrice}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(customer)}>
                      Update
                    </Button>
                  </TableCell>
                  <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleDelete(customer.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={message}
      />
    </div>
  );
}