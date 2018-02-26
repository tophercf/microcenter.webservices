const cheerio = require('cheerio');
const rp = require('request-promise');
const productController = require('./product');
const tough = require('tough-cookie');
const uuidv4 = require('uuid/v4');

function returnCookieJarSettings(req, rp) {
  /*
  Insert a cookie to spoof location 
  */
  let cookie = new tough.Cookie({
    key: "storeSelected",
    value: req.payload.storeId,
    domain: '.microcenter.com',
    httpOnly: true,
    maxAge: 31536000
  });
  // ignore toughcookie when it tries to fail based on domain mismatch
  var cookieJar = rp.jar();
  cookieJar.setCookie(cookie, '.microcenter.com', {
    ignoreError: true
  });
  return cookieJar;
}

exports.getPageCountForCategory = (req, h) => {
  var options = {
    uri: 'http://www.microcenter.com/search/search_results.aspx?N=' + req.payload.categoryId,
    jar: returnCookieJarSettings(req, rp),
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  return rp(options).then(($)=>{
    let items = $('.pagination').first().find('.status').text().split('of')[1].replace('items','').trim();
    let pageCount = Math.ceil(parseInt(items) / 25);
    return {
      'pageCount': pageCount
  };
  }).catch((e) => {
    return console.log(e);
  });

}

exports.scrape = (req, h) => {
  var options = {
    uri: 'http://www.microcenter.com/search/search_results.aspx?N=4294966937&NTK=all&page=2',
    jar: returnCookieJarSettings(req, rp),
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  // set guid for run
  const guid = uuidv4();

  return rp(options)
    .then(function ($) {
      console.log('product iteration start');
      let productList = [];

      let products = $('.product_wrapper').each((index, product) => {
        console.log('this is index ' + index);

        let leftFrame = $(product).find('a.image');
        let name = leftFrame.data('name');
        let imageLocation = leftFrame.find('img').attr("src");
        let price = leftFrame.data('price');
        let brand = leftFrame.data('brand');
        let link = leftFrame.attr('href');

        let rightFrame = $(product).find('.result_right');
        let sku = rightFrame.find('p.sku').text().split(' ')[1];
        let stock = rightFrame.find('.stock').find('strong').text().split(' ')[0];
        let inStoreOnly = false;
        if (rightFrame.find('.instore').find('.limitNoSale').length > 0) {
          inStoreOnly = true;
        }
        let runGroup = guid;

        productList.push({
          'name': name,
          'imageLocation': imageLocation,
          'price': price,
          'brand': brand,
          'link': link,
          'sku': sku,
          'stock': stock,
          'inStoreOnly': inStoreOnly,
          'runGroup': runGroup
        });
      });


      return {
        'message': 'Found products on page.',
        'body': productList
      };
    })
    .catch((e) => {
      return console.log(e);
    });

}