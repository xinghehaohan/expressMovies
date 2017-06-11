 /**
 * Created by su on 17/3/29.
 */
 var mongoose = require('mongoose');
 var MovieShema = require('../schemas/movie.js');
 var Movie = mongoose.model('Movie',MovieShema);
  module.exports = Movie;