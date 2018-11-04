var express = require("express");
var router = express.Router();
const PirateBay = require("thepiratebay");
var cors = require('cors')

router.get("/", function (req, res, next) {
  res.send('All GOOD');
});

router.post("/tpb/search", function (req, res, next) {
  var torrent_name = req.body.torrent_name;

  if(torrent_name.length <=0 ){
    res.json(returnResponse(false,'Please Fill Torrent Name With Valid Data'));
  }

  PirateBay.search(torrent_name)
  .then(results => res.json(returnResponse(true,shapeResponse(results))))
  .catch(err => res.json(returnResponse(false,err)));
});

router.get("/tpb/categories", function (req, res, next) {

  PirateBay.getCategories()
  .then(results => res.json(returnResponse(true,shapeResponse(results))))
  .catch(err => res.json(returnResponse(false,err)));
});

router.get("/tpb/top/:id", function (req, res, next) {
  var id = req.params.id;
  PirateBay.topTorrents(id)
  .then(results => res.json(returnResponse(true,shapeResponse(results))))
  .catch(err => res.json(returnResponse(false,err)));
});


function returnResponse(status,data){
  var returnResponse = {status : status,data : data};
  return returnResponse;
}

function shapeResponse(response) {
  console.log(response);
  var tor_reponse = [];
  console.log(Object.keys(response).length);
  return response;
  if (Object.keys(response).length > 0) {
    for (var key in response) {
      if (response.hasOwnProperty(key)) {
        if (typeof response[key] == "object") {
          tor_reponse.push({
            id: response[key]["id"],
            name: response[key]["name"],
            size: response[key]["size"],
            seeders: response[key]["seeders"],
            leechers: response[key]["leechers"],
            magnetLink: response[key]["magnetLink"],
            uploadDate: response[key]["uploadDate"],
            verified: response[key]["verified"],
          });
        } else {
          tor_reponse.push({
            id: response["id"],
            name: response["name"],
            size: response["size"],
            seeders: response["seeders"],
            leechers: response["leechers"],
            magnetLink: response["magnetLink"],
            uploadDate: response["uploadDate"],
            verified: response["verified"],
          });
        }
      }
    }
  }
  console.log(typeof tor_reponse)
  return tor_reponse;
}
module.exports = router;
