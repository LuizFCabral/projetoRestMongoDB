import express from 'express'

const app = express()
const port = 4000

//import das rotas da app
import rotasPessoas from './routes/pessoa.js'

app.use(express.json())//irá fazer o parse de arquivos 
//Rotas de conteudo publico 

app.use('/', express.static('public'))

app.use('/api/pessoa', rotasPessoas)

app.get('/api', (req, res) =>{
    res.status(200).json({
        message: "API fatec funcinando",
        version: "1.0.1"
    })
})


//Rotas de exceção - devem ser as últimas
app.use((req, res)=>{
    res.status(404).json({
        errors: [{
            value: `${req.originalUrl}`,
            msg: `A rota ${req.originalUrl} não existe nesta API!`,
            param: 'invalid route'
        }]
    })
})

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})