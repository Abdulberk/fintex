const mongoose = require('mongoose');

const musteriSchema = new mongoose.Schema({

    terminHaftasi: {
        type: String,
    },
    takim: {
        type: String,

    },
    MusteriAd: {
        type: String
    },
    siparisNo: {
        type: String
    },
    rtpNo: {
        type: String
    },
    renk: {
        type: String
    },
    siparisGirisTarihi: {
        type: Date

    },
    yuklemeTermini: {
        type: Date
    },
    kesimOk: {
        type: Date
    },
    kesimTarihi: {
        type: Date
    },
    dikimYeri: {
        type: String,
    },
    dikimIlkCikisTarihi: {
        type: String,
    },
    toplantiNotlari: {
        type: String,
    },
    takipEdecekDept: {

    },
    mtRevTeslimTarihi: {
        type: String,
    },
        siparisAdedi: {
            type: Number
        },
        kesimAdedi : {
            type: Number
        },
        dikimAdedi : {
            type: Number
        },
        paketAdedi: {
            type: Number
        },
        yuklemeAdedi: {
            type: Number
        },
        eksikYukleme : {
            type: Number
        },
        satir: {
            type: String},
        reelKumasPlan: {
            type: String
        },
        hamKumasCikis: {
            type: String
        },
        utuPaket: {
            type: String
        },
        yukleme: {
            type: String
        }

})


const Musteri = mongoose.model('Musteri', musteriSchema);

module.exports = Musteri;

