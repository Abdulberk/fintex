const mongoose = require('mongoose');

const fiyatKalemSchema = new mongoose.Schema({

    siparisNo:{
        type: String

    },
    rptNo:{
        type: String
    },

    malzeme: {
        type: String
    },
    
    malzemeDesc: {
        type: String
    },

    unit: {
        type: String
    },
    toplamGelenMiktar: {
        type: mongoose.Decimal128,
    },
    aksesuarFiyat: {
        type: mongoose.Decimal128,
    },
    kalemToplamFiyat: {

        type: mongoose.Decimal128,
    },

    siparisMiktar: {
        type: mongoose.Decimal128,
    },

})

const FiyatKalem = mongoose.model('FiyatKalem', fiyatKalemSchema);

module.exports = FiyatKalem;


