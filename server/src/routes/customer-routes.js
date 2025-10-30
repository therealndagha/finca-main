import express from 'express';
import {
  addCustomers,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
  getCustomerById,
} from '../controllers/customer-controllers.js';

const router = express.Router();

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', addCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
