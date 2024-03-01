import {config} from 'dotenv'
config();

export const PORT = process.env.PORT;

export const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;

export const FRONTED_URL = process.env.FRONTED_URL;
