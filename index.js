const chain = require('async-chain-proxy');
const LightHouseCmd = require('./lighthouse-cmd');
const test = chain(new LightHouseCmd());
test
  .launch()
  .lighthouse("https://www.baidu.com/")
  .reportToFile("./test1.html")
  .lighthouse("https://www.baidu.com/")
  .reportToFile("./test2.html")
  .lighthouse("https://www.baidu.com/")
  .reportToFile("./test3.html")
  .lighthouse("https://www.baidu.com/")
  .reportToFile("./test4.html")
  .kill()
  .end();
