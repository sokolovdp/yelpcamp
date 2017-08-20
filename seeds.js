var Campground = require('./models/campground');

function seedDB(){
    // clean campgrounds database
    Campground.remove({}, function(err){
        if (err) {
             console.log('remove campgrounds err:');
             console.log(err);
        }
        else {
            console.log('all campgrounds removed!');
            // campgrounds.forEach(function(camp) { createCampground(camp) });
        }
    });
}    

module.exports = seedDB;