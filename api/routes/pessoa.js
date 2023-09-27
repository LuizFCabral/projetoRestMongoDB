//API REST dos pessoa
import exepress from 'express'
import { check, validationResult } from 'express-validator'
import {connectToDatabase} from '../utils/mongodb.js'

const router =  exepress.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'pessoa'

const validaPessoa = [
    check('nome')
    .not().isEmpty().trim()
    .withMessage("É obrigatório informar o Nome")
    .isLength({min: 3}).withMessage("O nome deve ter 3 números no mínimo"),
    check('altura')
    .not().isEmpty().trim()
    .withMessage("É obrigatório informar a altura")
    .isNumeric(),
    check('signo')
    .not().isEmpty().trim()
    .withMessage("É obrigatorio informar o signo"),
    check('data_nasc')
    .not().isEmpty().trim()
    .withMessage("É obrigatório informar a data de nascimento"),
    check('qtd_dentes').optional({nullable: true})
    
]

// GET /api/pessoa
// lista de todos os pessoa

router.get('/', async(req, res)=> {
    try{
        db.collection(nomeCollection).find().sort({nome: 1})
        .toArray((err, docs)=>{
            if(!err)
                res.status(200).json(docs)
        })
    }
    catch(err){
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter a listagem dos pessoa',
                param: '/'
            }]
        })
    }
})

// GET /api/pessoa/:id
// lista os pessoa pelo id
router.get('/:id', async(req, res)=>{
    try{
        db.collection(nomeCollection).find({'_id': {$eq:  ObjectId(req.params.id)}})
        .toArray((err, docs)=>{
            if(err)
                res.status(400).json(err) //bad request
            else    
                res.status(200).json(docs)
        })
    }catch(err){
        res.status(500).json({"error": err.message})
    }
})

// GET /api/pessoa/razao/:razao
// lista os pessoa pela razao
router.get('/razao/:razao', async(req, res)=>{
    try{
        db.collection(nomeCollection)
        .find({'razao_social': {$regex:  req.params.razao, $options: "i"}})
        .toArray((err, docs)=>{
            if(err)
                res.status(400).json(err) //bad request
            else    
                res.status(200).json(docs)
        })
    }catch(err){
        res.status(500).json({"error": err.message})
    }
})

// DELETE /api/pessoa/:id
// Apaga o prestador
router.delete('/:id', async(req, res)=>{
    await db.collection(nomeCollection)
    .deleteOne({"_id": {$eq: ObjectId(req.params.id)}})
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).json(err))
})

// POST /api/pessoa/:id
// Insere um prestador
router.post('/', validaPrestador, async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    }else{
        await db.collection(nomeCollection)
        .insertOne(req.body)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))

    }

})

router.put('/', validaPrestador, async(req, res)=>{
    let idDocumento = req.body._id //armazena o id do documento
    delete req.body._id //iremos remover o id do body

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    }else{
        await db.collection(nomeCollection)
        .updateOne({'_id': {$eq: ObjectId(idDocumento)}},
                    {$set: req.body})
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))

    }
})


export default router
