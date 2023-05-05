    const express = require('express');
    const dotenv = require('dotenv');
    const Musteri = require('./models/Musteri');
    const xlsx = require('xlsx');
    const fs = require('fs');
    const cors = require('cors');
    const mongoose = require('mongoose');
    const bodyParser = require('body-parser');
    const moment = require('moment');
    const path = require('path');
    const Maliyet = require('./models/Maliyet');
    const FiyatKalem = require('./models/FiyatKalem');
    const SiparisDetay = require('./models/SiparisDetay');
const events = require('events').setMaxListeners(0);



    const app = express();

    dotenv.config();
    const PORT = 3000;

    app.use(bodyParser.json());
    app.use(cors());


    const connectDB = async()=> {
        try{
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected');
        }catch(error){
            console.log(error.message);

        }
    }

    const directoryPath = "./";
    let sheetData = {
    imalat: [],
    fiyatKalem: [],
    maliyet: [],
    siparisDetay: [],
    };

    try {
    const files = fs.readdirSync(directoryPath);
    files.forEach(function (file) {
        if (path.extname(file) === ".xlsx" || path.extname(file) === ".xls") {
        const workbook = xlsx.readFile(file);
        const sheetNames = workbook.SheetNames;
        const sheetName = sheetNames[0];
        const currentSheetData = xlsx.utils.sheet_to_json(
            workbook.Sheets[sheetName]
        );
        
        
        if (file === "imalat.xlsx") {
            sheetData.imalat.push(...currentSheetData);
        } else if (file === "FiyatKalem.xlsx") {
            sheetData.fiyatKalem.push(...currentSheetData);
        } else if (file === "Maliyet.xlsx") {
            sheetData.maliyet.push(...currentSheetData);
            }
            else if (file === "SiparisDetay.xlsx") {
            sheetData.siparisDetay.push(...currentSheetData);
           
            }
            else
            {
                console.log("Dosya ismi hatalı: " + file);
            }


        }
    });
    } catch (err) {
    console.log("Dizin taranamadı... " + err.message);
    }



    const parseDate = (dateStr) => {
       
        if (typeof dateStr !== "string") {
        console.log("dateStr is not a string:", dateStr);
        return null;
        }
        const [day, month, year, ...time] = dateStr.split(/[.\s:]+/);
    
        return new Date(
        Date.UTC(year, month - 1, day, ...time) - new Date().getTimezoneOffset() * 60 * 1000

        );
    };


    const parseDetayDate = (date) => {


            return new Date(Math.round((date - 25569)*86400*1000));
       

    };
 
    
        const newData = sheetData.imalat.map((musteri)=> {

            let {"Sipariş.No": _ ,
                    "Sipariş.No_1": __,
                    "Sipariş.No_2":siparisNo, 
                    "Revz.Termin Haftası": terminHaftasi,
                    "Takım": takim,
                    "Müşteri": MusteriAd,
                    "Rpt.No": rtpNo,
                    "Renk": renk,
                    "sipariş giriş tarihi":siparisGirisTarihi,
                    "yükleme termini": yuklemeTermini,
                    "KESİM OK": kesimOk,
                    "KESİM": kesimTarihi,
                    "Dikim Yeri": dikimYeri,
                    "Dikime İlk Çıkış": dikimIlkCikisTarihi,
                    "24.04.2023 TOPLANTI NOTLARI" : toplantiNotlari,
                    "24.04.2023 TAKİP EDECEK DEPT.": takipEdecekDept,
                    "MT REV. TESLİM  TARİHİ" : mtRevTeslimTarihi,
                    " Sipariş  Adedi ": siparisAdedi,
                    " Kesim Adedi " : kesimAdedi,
                    " Dikim Adedi " : dikimAdedi,
                    " Paket Adedi " : paketAdedi,
                    " Yükleme Adedi " : yuklemeAdedi,
                    " EKSİK YÜKLEME ": eksikYukleme,
                    "Satır" : satir,
                    "Reel Kumaş Plan" : reelKumasPlan,
                    "HAM KUMAŞ ÇIKIŞ": hamKumasCikis,
                    "ÜTÜ-PAKET": utuPaket,
                    "YUKLEME" : yukleme,
            
            ...rest} = musteri;


                    
        const parsedKesimAdedi = Number.parseInt(kesimAdedi);
        if (Number.isNaN(parsedKesimAdedi)) {
        return null;
        }

        const parsedDikimAdedi = Number.parseInt(dikimAdedi);
        if (Number.isNaN(parsedDikimAdedi)) {
            return null;
            }

        const parsedPaketAdedi = Number.parseInt(paketAdedi);
        if (Number.isNaN(parsedPaketAdedi)) {

            return null;
            }

        const parsedYuklemeAdedi = Number.parseInt(yuklemeAdedi);
        if (Number.isNaN(parsedYuklemeAdedi)) {
            return null;
            }

        const parsedEksikYukleme = Number.parseInt(eksikYukleme);
        if (Number.isNaN(parsedEksikYukleme)) {
            return null;
            }
        
            return {
                siparisNo,
                terminHaftasi,
                takim,
                MusteriAd,
                rtpNo,
                renk,
                siparisGirisTarihi: parseDate(siparisGirisTarihi),
                yuklemeTermini : parseDate(yuklemeTermini),
                kesimOk : parseDate(kesimOk),
                kesimTarihi: parseDate(kesimTarihi),
                dikimYeri,
                dikimIlkCikisTarihi,
                toplantiNotlari,
                takipEdecekDept,
                mtRevTeslimTarihi,
                siparisAdedi,
                kesimAdedi: parsedKesimAdedi,
                dikimAdedi : parsedDikimAdedi,
                paketAdedi : parsedPaketAdedi,
                yuklemeAdedi : parsedYuklemeAdedi,
                eksikYuklemeler : parsedEksikYukleme,
                satir,
                reelKumasPlan,
                hamKumasCikis,
                utuPaket,
                yukleme,
                ...rest
            }
        })

        const newFiyatKalemData = sheetData.fiyatKalem.map((fiyatKalemObjesi)=> {

            let {"Rpt No":rptNo,
                "Sipariş No":__,
                "Malzeme":malzeme,
                "Malzeme Açık.": malzemeDesc,
                "Birim": unit,
                "Toplam Gelen Miktar": toplamGelenMiktar,
                "Aksesuar Fiyat": aksesuarFiyat,
                "Kalem Top. (TL)": kalemToplamFiyat,
                "Finteks SipNo" : siparisNo,
                "Sipariş Miktarı" : siparisMiktar,


        } = fiyatKalemObjesi;

            
                const parseValue = (amount) => {

                const parsedValue = Number(parseFloat(amount).toFixed(2));

                return parsedValue;
                }


                const parsedToplamGelenMiktar = parseValue(toplamGelenMiktar);
                if (Number.isNaN(parsedToplamGelenMiktar)) {
                return null;
                }

                const parsedAksesuarFiyat = parseValue(aksesuarFiyat);
                if (Number.isNaN(parsedAksesuarFiyat)) {
                return null;
                }

                const parsedKalemToplamFiyat = parseValue(kalemToplamFiyat);
                if (Number.isNaN(parsedKalemToplamFiyat)) {
                return null;
                }

                const parsedSiparisMiktar = parseValue(siparisMiktar);
                if (Number.isNaN(parsedSiparisMiktar)) {
                return null;
                }



                return {
                    rptNo,
                    malzeme,
                    malzemeDesc,
                    unit,
                    toplamGelenMiktar: parsedToplamGelenMiktar,
                    aksesuarFiyat:  parsedAksesuarFiyat,
                    kalemToplamFiyat:parsedKalemToplamFiyat,
                    siparisNo,
                    siparisMiktar: parsedSiparisMiktar,
                }

        })


        const newMaliyetData = sheetData.maliyet.map((maliyetObjesi)=> {

                        let {"ORDERCODE":siparisNo,
                            "ORDNUM":rptNo,
                            "MATTYPE":matType,
                            "COSTMAT": costMat,
                            "STEXT": sText,
                            "TL": cost,
                        
                        
                    } = maliyetObjesi;


                        const parseValue = (amount) => {

                        const parsedValue = Number(parseFloat(amount).toFixed(2));

                        return parsedValue;

                        }


                        const parsedCost = parseValue(cost);
                        if (Number.isNaN(parsedCost)) {
                        return null;
                        }


                        return {

                            siparisNo,
                            rptNo,
                            matType,
                            costMat,
                            sText,
                            cost: parsedCost,
                        }

                    })


        const newSiparisDetayData = sheetData.siparisDetay.map((siparisDetayObjesi)=> {


            let {
                "Teslim Tarihi" : teslimTarihi,
                "Stoğa Giriş Tarihi" : stokGirisTarihi,
                "Tedarikçi" : tedarikci,
                "İsim" : isim,
                "Malzeme" : malzeme,
                "Malzeme Açık." : malzemeDesc,
                "Sipariş Miktarı" : siparisMiktar,
                "Toplam Gelen Miktar" : toplamGelenMiktar,
                "Gelen Miktar" : gelenMiktar,
                "Faturalanan Mikt." : faturalananMiktar,
                "Fatura Birim Fiyat" : faturaBirimFiyat,
                "Kalem Top." : kalemToplam,
                "Kalem Top. (TL)" : kalemToplamTL,
                "Fiyat" : fiyat,
                "Aksesuar Fiyat" : aksesuarFiyat,
                "Sipariş Tarihi" : siparisTarihi,
                "Sipariş Kalemi" : siparisKalem,
                "Müşteri" : musteri,
                "Finteks SipNo" : siparisNo,
                "Rpt No" : rptNo,
                "Oluşturan" : olusturan,
                

            } = siparisDetayObjesi;

            
                const parseValue = (amount) => {
                const parsedValue = Number(parseFloat(amount).toFixed(2));
                return parsedValue;
                }


                const parsedSiparisMiktar = parseValue(siparisMiktar);
                if (Number.isNaN(parsedSiparisMiktar)) {
                return null;
                }

                const parsedToplamGelenMiktar = parseValue(toplamGelenMiktar);
                if (Number.isNaN(parsedToplamGelenMiktar)) {
                return null;
                }

                const parsedGelenMiktar = parseValue(gelenMiktar);
                if (Number.isNaN(parsedGelenMiktar)) {
                return null;
                }

                const parsedFaturalananMiktar = parseValue(faturalananMiktar);
                if (Number.isNaN(parsedFaturalananMiktar)) {
                return null;
                }

                const parsedFaturaBirimFiyat = parseValue(faturaBirimFiyat);
                if (Number.isNaN(parsedFaturaBirimFiyat)) {
                return null;
                }

                const parsedKalemToplam = parseValue(kalemToplam);
                if (Number.isNaN(parsedKalemToplam)) {

                return null;
                }

                const parsedKalemToplamTL = parseValue(kalemToplamTL);
                if (Number.isNaN(parsedKalemToplamTL)) {
                return null;
                }

                const parsedFiyat = parseValue(fiyat);
                if (Number.isNaN(parsedFiyat)) {
                return null;
                }

                const parsedAksesuarFiyat = parseValue(aksesuarFiyat);
                if (Number.isNaN(parsedAksesuarFiyat)) {

                return null;
                }

                const parsedTeslimTarihi = parseDetayDate(teslimTarihi);
                console.log(parsedTeslimTarihi)
                
               const parsedSiparisTarihi = parseDetayDate(siparisTarihi);
                console.log(parsedSiparisTarihi)





                return {
                    teslimTarihi: parsedTeslimTarihi,
                    stokGirisTarihi:parseDate(stokGirisTarihi),
                    tedarikci,
                    isim,
                    malzeme,
                    malzemeDesc,
                    siparisMiktar: parsedSiparisMiktar,
                    toplamGelenMiktar: parsedToplamGelenMiktar,
                    gelenMiktar: parsedGelenMiktar,
                    faturalananMiktar: parsedFaturalananMiktar,
                    faturaBirimFiyat: parsedFaturaBirimFiyat,
                    kalemToplam: parsedKalemToplam,
                    kalemToplamTL: parsedKalemToplamTL,
                    fiyat: parsedFiyat,
                    aksesuarFiyat:  parsedAksesuarFiyat,
                    siparisNo,
                    siparisTarihi: parsedSiparisTarihi,
                    siparisKalem,
                    musteri,
                    rptNo,
                    olusturan,

                }



        })





        sheetData.imalat = [...newData] 
        sheetData.fiyatKalem = [...newFiyatKalemData] 
        sheetData.maliyet = [...newMaliyetData] 
        sheetData.siparisDetay = [...newSiparisDetayData]





        app.get('/getir', async (req, res) => {

            return res.json({
           detay: sheetData.siparisDetay
                
            })
        
        });
        
        


        const oranla = (siparisAdet,dikimAdet) => {

            if(siparisAdet === 0 || dikimAdet === 0){
                return 0;
            }
            return  `sipariş adedi sayısı ve dikime sevk edilenlerin oranı % ${Math.round((dikimAdet / siparisAdet) * 100)}`
        }


        app.get('/aylara-gore-akseuar-bilgisi/:siparisNo', async (req, res) => {

            if (!req.params.siparisNo) {
                return res.status(400).send({
                    message: "lütfen geçerli bir sipariş numarası giriniz"
                })
            }

            

            const ocak = new Date('Sun Jan 01 2023 00:00:00 GMT+0300');
            const subat = new Date('Sun Feb 01 2023 00:00:00 GMT+0300');
            const mart = new Date('Sun Mar 01 2023 00:00:00 GMT+0300');
            const nisan = new Date('Sun Apr 01 2023 00:00:00 GMT+0300');
            const mayis = new Date('Sun May 01 2023 00:00:00 GMT+0300');


            
    const ocakSiparis = await Musteri.aggregate([
        {
        $match: {
            siparisNo: req.params.siparisNo,
            siparisGirisTarihi: {
            $gte: ocak,
            $lte: subat
            }
        }
        },
        {
        $project: {
            siparisNo: 1,
            dikimAdedi: 1,
            siparisAdedi: 1,
            siparisGirisTarihi: 1,
            renk: 1,
            _id: 0
        }
        },
        {
        $sort: {
            siparisGirisTarihi: 1
        }
        }
    ]);

    const subatSiparis = await Musteri.aggregate([
        {
        $match: {
            siparisNo: req.params.siparisNo,
            siparisGirisTarihi: {
            $gte: subat,
            $lte: mart
            }
        }
        },
        {
        $project: {
            siparisNo: 1,
            dikimAdedi: 1,
            siparisAdedi: 1,
            siparisGirisTarihi: 1,
            renk: 1,
            _id: 0
        }
        },
        {
        $sort: {
            siparisGirisTarihi: 1
        }
        }
    ]);

    const martSiparis = await Musteri.aggregate([
        {
        $match: {
            siparisNo: req.params.siparisNo,
            siparisGirisTarihi: {
            $gte: mart,
            $lte: nisan
            }
        }
        },
        {
        $project: {
            siparisNo: 1,
            dikimAdedi: 1,
            siparisAdedi: 1,
            siparisGirisTarihi: 1,
            renk: 1,
            _id: 0
        }
        },
        {
        $sort: {
            siparisGirisTarihi: 1
        }
        }
    ])


    const nisanSiparis = await Musteri.aggregate([
        {
        $match: {
            siparisNo: req.params.siparisNo,
            siparisGirisTarihi: {
            $gte: nisan,
            $lte: mayis
            }
        }
        },
        {
        $project: {
            siparisNo: 1,
            dikimAdedi: 1,
            siparisAdedi: 1,
            siparisGirisTarihi: 1,
            renk: 1,
            _id: 0
        }
        },
        {
        $sort: {
            siparisGirisTarihi: 1
        }
        }
    ]);

    return res.status(200).json({
        ocak: ocakSiparis.length > 0 ? ocakSiparis : "sipariş bulunamadı",
        subat: subatSiparis.length > 0 ? subatSiparis : "sipariş bulunamadı",
        mart: martSiparis.length > 0 ? martSiparis : "sipariş bulunamadı",
        nisan: nisanSiparis.length > 0 ? nisanSiparis : "sipariş bulunamadı",
        })


    }

        )

    app.get('/musteriler', async (req, res) => {

        const baslangicTarihi = new Date('Sun Jan 01 2023 00:00:00 GMT+0300');
        const bitisTarihi = new Date('Sun Apr 30 2023 16:09:34 GMT+0300');

        const siparisNolar = await Musteri.find({
        siparisNo: { $exists: true },
        $and: [
            { siparisGirisTarihi: { $gte: baslangicTarihi} },
            { siparisGirisTarihi: { $lte: bitisTarihi } },
        ],
        }, {
        siparisNo: 1,
        dikimAdedi: 1,
        siparisAdedi: 1,
        siparisGirisTarihi: 1,
        renk: 1,
        _id: 0,
        }).sort({siparisGirisTarihi: "asc"})

        return res.json({

        sonuclar: siparisNolar.map((musteri)=> {
                
                const { siparisNo, dikimAdedi, siparisAdedi, siparisGirisTarihi,renk } = musteri;
        
                return {
                    siparisNo,
                    siparisAdedi,
                    dikimAdedi,
                    siparisGirisTarihi,
                    renk,
                    oran: oranla(siparisAdedi,dikimAdedi)
                }

        })



        });
    });

    app.get('/maliyet-hesapla', async (req, res) => {
        try {
          const maliyetler = await Maliyet.find({});
          const fiyatKalemleri = await FiyatKalem.find({});
      
          const result = [];
      
          maliyetler.forEach((aksesuar) => {
            const fiyatKalem = fiyatKalemleri.find((f) => f.siparisNo === aksesuar.siparisNo);

            if (!aksesuar.siparisNo) {
                result.push({
                    siparisNo: aksesuar.siparisNo,
              message: "sipariş numarası bulunamadı!",
                });
                }

            if (fiyatKalem) {
              const maliyetCost = parseFloat(aksesuar.cost);
              const fiyatKalemAksesuarFiyat = parseFloat(fiyatKalem.aksesuarFiyat);
      

                if (maliyetCost > fiyatKalemAksesuarFiyat) {
                const diff = maliyetCost - fiyatKalemAksesuarFiyat;
                const oran = (diff / fiyatKalemAksesuarFiyat) * 100;

                result.push({
                    siparisNo: aksesuar.siparisNo,
                    message: `Maliyet tablosundaki ${aksesuar.siparisNo} sipariş numarası için ${aksesuar.cost} TL olan maliyet fiyatı, Fiyat-Kalem tablosundaki ${aksesuar.siparisNo} sipariş numarası için ${fiyatKalem.aksesuarFiyat} TL olan aksesuar fiyatından ${diff.toFixed(2)} TL daha yüksek. Bu da beklenenden ${Math.round(oran)}% daha yüksek demek!`,

                })
            }

            if (maliyetCost < fiyatKalemAksesuarFiyat) {
                const diff = fiyatKalemAksesuarFiyat - maliyetCost;
                const oran = (diff / fiyatKalemAksesuarFiyat) * 100;

                result.push({
                    siparisNo: aksesuar.siparisNo,
                    message: `Maliyet tablosundaki ${aksesuar.siparisNo} sipariş numarası için ${aksesuar.cost} TL olan maliyet fiyatı, Fiyat-Kalem tablosundaki ${aksesuar.siparisNo} sipariş numarası için ${fiyatKalem.aksesuarFiyat} TL olan aksesuar fiyatından ${diff.toFixed(2)} TL daha düşük. Bu da beklenenden ${Math.round(oran)}% daha düşük demek!`,

                })
            }

            if (!fiyatKalem) {
                result.push({
                  siparisNo: aksesuar.siparisNo,
                  message: `Fiyat-Kalem tablosunda ${aksesuar.siparisNo} ile eşleşen IBM numarası bulunamadığı için hesaplama yapılamadı!`,
                });
              }

            }

          });
      
         return res.json(result);
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });
      






    connectDB().then(()=> {

        Musteri.deleteMany({}).then(()=> {
            console.log("Musteri datası silindi");
        }).then(()=> {
                
                Maliyet.deleteMany({}).then(()=> {
                    console.log("Maliyet datası silindi");
                }).then(()=> {
                    FiyatKalem.deleteMany({}).then(()=> {
                        console.log("Fiyat Kalem datası silindi");
                    }).then(()=> {
                        SiparisDetay.deleteMany({}).then(()=> {
                            console.log("Siparis Detay datası silindi");
                        }).then(()=> {
                            console.log("Tüm veriler silindi");
                        }
                        )
 
                })
            }
            )
        })
        .catch((err)=> {
            console.log(err.message);
        }).then(()=> {

            Musteri.insertMany(sheetData.imalat).then(()=> {
                console.log("Musteri datası eklendi");
            }).then(()=> {

                Maliyet.insertMany(sheetData.maliyet).then(()=> {
                    console.log("Maliyet datası eklendi");
                }).then(()=> {
                    FiyatKalem.insertMany(sheetData.fiyatKalem).then(()=> {
                        console.log("Fiyat Kalem datası eklendi");
                    }).then(()=> {
                        SiparisDetay.insertMany(sheetData.siparisDetay).then(()=> {
                            console.log("Siparis Detay datası eklendi");
                        }).then(()=> {
                            console.log("Tüm veriler eklendi");
                        }
                        )
                    })
                })
            }
            )
            .catch((err)=> {
                console.log(err.message);
            }) 

        })

        }).catch((err)=> {
            console.log(err.message);
        })



    app.listen(PORT, () => {

        console.log(`Server is running on PORT ${PORT}`);

    });