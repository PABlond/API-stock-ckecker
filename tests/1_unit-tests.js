/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var StockHandler = require('../controllers/stockHandler.js');

const assert = chai.assert
var stockPrices = new StockHandler();

suite('Unit Tests', function(){
    test("Whole number input", done => {
        const input = "32L"
        assert.equal(stockPrices.getNum(input), 32)
        done()
      })
  
//none requiered

});