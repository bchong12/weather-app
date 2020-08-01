const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { title } = require('process')

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '/template/views')
const partialsPath = path.join(__dirname, '/template/partials')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { isBuffer } = require('util')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Branden'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Branden'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Branden'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'You must provide an address' })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    res.send({
        products: []
    })
})

// app.com (One Domain, and all of it is going to run on a single express server)
// app.com/help <= route
// app.com/about <= route
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Help Page',
        errorMessage: 'Help Page Not Found',
        name: 'Branden'
    })
})


app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'This directory does not exist',
        name: 'Branden'
    })
})

app.listen(3000, () => {
    console.log('server is up on port 3000')
})
