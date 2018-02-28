'use strict';

const Hapi = require('hapi');
const Good = require('good');
const mongoose = require('mongoose');
const ProductController = require('./controllers/microcenter/product');
const ScrapeController = require('./controllers/microcenter/scrape');
const MongoDBUrl = 'mongodb://localhost:27017/productapi';

const server = new Hapi.Server({
    port: 3000,
    host: 'localhost'
});


server.route({
    method: 'GET',
    path: '/',
    handler: ProductController.list
});

server.route({
    method: 'GET',
    path: '/product/{id}',
    handler: ProductController.get
});

server.route({
    method: 'POST',
    path: '/product',
    handler: ProductController.create
});

// create multiple products
server.route({
    method: 'POST',
    path: '/products',
    handler: ProductController.createMany
});

// pass in the store id to scrape
server.route({
    method: 'POST',
    path: '/scrape',
    handler: ScrapeController.scrape
});

// pass in the store id and category id to scrape
server.route({
    method: 'POST',
    path: '/category/count',
    handler: ScrapeController.getPageCountForCategory
});

/*
server.register({
    plugin: require('good-squeeze'),
    plugin: require('good-console')
}).then(()=> {
    
});
*/

(async () => {
    try {
        console.log('starting server');
        await server.start({port: 3000});
        await mongoose.connect(MongoDBUrl, {}).then(() => { console.log(`Connected to Mongo server`) }, err => { console.log(err) });
        console.log('finished server start');
    } catch (e) {
        console.log(e);
    }
})();
