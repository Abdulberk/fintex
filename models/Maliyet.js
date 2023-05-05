const mongoose = require('mongoose');

const maliyetSchema = new mongoose.Schema({

    siparisNo:{
        type: String

    },
    rptNo:{
        type: String
    },

    matType:{
        type: String
    },
    costMat:{
        type: String
    },

    sText :{
        type: String
    },
    cost :{
        type: mongoose.Decimal128,

    },
})

const Maliyet = mongoose.model('Maliyet', maliyetSchema);

module.exports = Maliyet;


