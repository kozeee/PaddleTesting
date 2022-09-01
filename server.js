const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express()
require('dotenv').config()
vendor = process.env.Vendor
authcode = process.env.Auth

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', async (req, res) => {



    res.render('checkout')
})

app.get('/checkoutHistory', async (req, res) => {
    let checkouts = {}
    let request = await axios.post('https://sandbox-vendors.paddle.com/api/2.0/product/33429/transactions',

        {
            vendor_id: '7617',
            vendor_auth_code: '0ec421d8b6c421be2460c11b4a27e19563cdd85656eecd172b',
            page: ''
        })
    for (response in request.data.response) {
        checkouts[request.data.response[response].order_id] = request.data.response[response].checkout_id
    }
    res.send(checkouts)
}
)

app.post('/checkout', async (req, res) => {
    let quantity = req.body.quantity
    const baseprice = 1
    let price
    let priceString

    if (quantity <= 5) {
        price = baseprice
        priceString = "USD:" + price
    }
    else if (quantity > 5 && quantity < 11) {
        price = baseprice * .9
        priceString = "USD:" + price
    }
    else if (quantity > 10 && quantity < 26) {
        price = baseprice * .8
        priceString = "USD:" + price
    }
    else if (quantity > 25) {
        price = baseprice * .7
        priceString = "USD:" + price
    }
    else {
        price = baseprice
        priceString = "USD:" + price
    }

    let request = await axios.post('https://vendors.paddle.com/api/2.0/product/generate_pay_link', {
        vendor_id: vendor,
        vendor_auth_code: authcode,
        product_id: '516459',
        title: '',
        webhook_url: '',
        prices: [priceString],
        quantity: quantity,
    })

    res.send(request.data.response.url)

}
)

app.listen(8080)