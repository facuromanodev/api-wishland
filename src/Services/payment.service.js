import Stripe from "stripe"
import { STRIPE_PRIVATE_KEY, FRONTED_URL } from '../config.js'
import { prisma } from "../db.js"

const stripe = new Stripe(STRIPE_PRIVATE_KEY)

const createSession = async (data) => {
  console.log(data)
  try{
    
    // Precio mayor a cero
    for(let i = 0; i < data.length; i++) {
      if(data[i].price <= 0) {
        return ('El precio debe ser mayor a cero')
      }
    }

    // Mapeo del array
    const lineItems = data.products.map(item => ({
      price_data: {
        product_data: {
          name: item.title,
        },
        currency: 'USD',
        unit_amount: (item.price * 100), //Conversion a centavos de dolar
      },
      quantity: 1,
    }));

    // Calcula el total de la compra
    const total = data.products.reduce((sum, item) => sum + item.price, 0);
    const feeOfBuyer = Math.round(total * 0.10 * 100); // Eliminar 10% del fee

    // Fee de la pagina
    lineItems.push({
      price_data: {
        product_data: {
          name: 'Wishland Fee',
        },
        currency: 'USD',
        unit_amount: feeOfBuyer, // 10% 
      },
      quantity: 1,
    });

    const feeOfSeller = Math.round(total * 0.05 * 100); // 5% del producto quitando el fee del comprador

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url:  `${FRONTED_URL}/profile`,
      cancel_url:  `${FRONTED_URL}/profile`,
      payment_intent_data: {
        application_fee_amount: feeOfSeller + feeOfBuyer,
        transfer_data: {
          destination: data.wallet
        },
      },
    })


    return session
  }catch(e){
    console.log(e.message);
    throw new Error(e.message);
  }
}


const createAccount = async (data) => {
  try{
    const user = await prisma.user.findFirst({
      where: {
        username: data.username
      }
    })

    const createAccount = await stripe.accounts.create({
      type: 'express',
      country: 'MX',
      business_type: 'individual',
      individual:{
        first_name: user.name,
        last_name: user.lastName,
        dob:{
          day: 1,
          month: 1,
          year: 1902,
        }
      },
      capabilities: {
        transfers : {
          requested: true,
        },
        card_payments: {
          requested: true,
        },
      },
      email: data.email,
        business_profile:{
        product_description: "This account is fot recive gift in Wishland",
        url:"www.x.com/username"
      }
    });
    
    const accountLink = await stripe.accountLinks.create({
      account: createAccount.id,
      refresh_url: `${FRONTED_URL}/profile`,
      return_url: `${FRONTED_URL}/profile`,
      type: 'account_onboarding',
    });

    await prisma.user.update({
      where: {
        username: data.username
      },
      data:{
        wallet: createAccount.id
      }
    })

  return {createAccount, accountLink}  

}catch(e) {
  throw new Error(e.message);
} 
}

export default {
  createSession,
  createAccount
} 