const mongoose = require('mongoose');


const siparisDetaySchema = new mongoose.Schema({

 
   teslimTarihi:{
        type: Date
    },

    stokGirisTarihi:{
        type: Date
    },

    tedarikci:{
        type: String
    },

    isim:{
        type: String
    },
    malzeme:{
        type: String
    },
    malzemeDesc:{
        type: String
    },

    siparisMiktar:{
        type: mongoose.Decimal128,
    },
    toplamGelenMiktar:{
        type: mongoose.Decimal128,
    },

    gelenMiktar:{
        type: mongoose.Decimal128,
    },
   
    faturalananMiktar:{
        type: mongoose.Decimal128,
    },

    faturaBirimFiyat:{
        type: mongoose.Decimal128,
    },
    kalemToplam:{
        type: mongoose.Decimal128,

    },
    kalemToplamTL:{
        type: mongoose.Decimal128,
    },
    fiyat:{
        type: mongoose.Decimal128,
    },
    aksesuarFiyat:{
        type: mongoose.Decimal128,
    },
    siparisTarihi:{
        type: Date
    },
    siparisKalem : {
        type: Number
    },
    musteri:{
        type: String
    },

    siparisNo:{
        type: String
    },
    rptNo:{
        type: String
    },
    olusturan:{
        type: String
    },












})

const SiparisDetay = mongoose.model('SiparisDetay', siparisDetaySchema);

module.exports = SiparisDetay;