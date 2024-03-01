import services from "../Services/payment.service.js";

const createSession = async (req, res) => {
    try{    
        const session = await services.createSession(req.body)
        res.status(200).send(session);

    }catch(e){
        return e.message
    }
}

const createAccount = async (req, res) => {
    try{    
        const account = await services.createAccount(req.body)
        res.status(200).send(account);

    }catch(e){
        return e.message
    }
}
export default {
    createSession,
    createAccount
}