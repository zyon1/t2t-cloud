/* 
 promjena struktrue - RIJESENO - baza podataka restukturirana
 actions - djelomicno rijeseno - ima novu strukturu, treba vidjeti sto dalje
 TODO:
 - users bazu izmijeniti:
    data.service: - djelomicno rijeseno - prepisana vecina funkcija neke nisu testirane
    login.service: - get permissions bi prema novoj bazi trebao se zvati getUser jer se users podjelio na users(podaci o računu) i userData( podaci o korisniku) - RIJESENO - u potpunosti
    email izbačen iz podataka o korisniku jer se nalazi u firebase podatcima - RJESENO - odustao od ideje
 - userData bazu kreirati i prilagoditi skripte - RJESENO - baza kreirana i prilagodjene skripte
 - auth-guard.service.ts
    - AuthGuard - Promise<boolean> izbaciti sve nepotrebno, flow: da li je user fetchan, ako nije zapamti url i prebaci na /login, kada se user logira vrati na traženi url
    - AdminGuard - Promise<boolean> izbaciti authGuard iz koda i samo staviti ako je admin, ako nije generiraj 403(Zabranjen pristup) - definiran u errors.component.ts
    - GroupGuard - Promise<boolean> izbaciti sve nepotrebno, provjera da li korisnik ima pristup grupi koju želi otvoriti, ako nema pristup generiraj 403(zabranjen pristup)
 - register-from.component - izbačena - i uključena unutar login-forme - RIJESENO 
 - form validation login-form.component, user-data.component, ...
 - kod kreiranja Observable -a ukoliko nije dio Guard servisa ... observer.next(false); observer.complete() treba zamijeniti sa observer.error(err); - RIJESENO - naucio komibnirati observables


   GOOGLE MAPS API key
   Project name: t2t-cloud (isti projekt kao i firebase)
   API key: AIzaSyBK5kZUnD5OtI2Zupbg1YohUdqkU7DvuOI

   GOOGLE PLACE AUTOCOMPLETE - nije dobro vako traziti request za app, bolje direktno - implementacija unutar new-object.component - trebalo bi nekad preimentovati u edit object
   docs:
   https://developers.google.com/places/web-service/autocomplete
   example:
   https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Vict&types=geocode&language=en&location=37.76999,-122.44696&radius=500&key=AIzaSyBK5kZUnD5OtI2Zupbg1YohUdqkU7DvuOI


*/     
interface DataStructure {
    users: {
        uid:{
            isAdmin:boolean,
            touched: boolean,
            activated: boolean,
            primaryGroup: string, //group key
            created: number //creation time
        }
    },
    userData: {
        uid: {
            email: string,
            name: string,
            surname: string,
            oib:string,
            address:string,
            postcode:string,
            city:string,
            country:string,
            obrt:string
        }
    }
    actions: {
        actionKey: {
            event:string,
            time: number,
            uid: string
        }
    },
    group: {
        groupKey: {
            groupName: string,
            groupType: string
        }
    },
    groupMembers: {
        groupKey: {uid:{role: string}}
    }
    watcher: {
        uid: {
            wid:{
                event:string,
                created:number,
                active:boolean,
                delivered:boolean,
                error:string,
                solved: boolean
            }
        }

    }
    groupWatcher: {
        gid: {event}
    }
    groupMessages:{
        gid:{
            messageID:{
                senderID: string,
                senderName: string,
                senderSurname:string,
                timestamp:number,
                seen : string[];//store id-s
                recieved: string[];
                text: string;
            }
        }
    }
    myChats:{
        uid:''/*array of recipents*/;
    },
    
    userMessages:{
        recipentUid: {
            pushID: {
                senderUid:string,
                senderName:string,
                senderSurname:string,
                timestamp:number,
                seen: boolean,
                recieved: boolean,
                text: string
            }

        }
    }
    tOjects:{
        oid: {
            name: string,
            autonomus: boolean,
            standard: number,
            location: {
                street: string,
                streetNr: string,
                place: string,
                postcode: string,
                country: string,
                lat: number,
                lng: number    
                }
            type: any,
            subType: any, 
            /*
            objectTypes=['Privatni smještaj', 'Hotel', 'Hostel', 'Pansion', 'Ostalo'];
            objectSubTypes=['Apartman, soba studio', 'Villa', 'Kuća za odmor', 'Robinzonski smještaj', 'Agro turizam', 'Kamena kuća'];
             */
            created: number,
            active: boolean,
            createdBy: string,//uid
            ready: boolean // ako nije minimalan broj podataka popunjen onda je false       
        }
    }
    groupObjects: {
        gid: {
            oid: string,
            // other data???
        }
    }
    objectData:{
        oid: {
            parking: number, // 1: public free, 2. public paid, 3. parking place, 4. garage
            wifi: boolean,
            pets: boolean,
            petsPrice:any,
            playground: boolean, //kids playground
            pool: boolean,
            grill: boolean,
            peka: boolean,
            others: {
                name: {value}//...
            }
            shortDesc: string,
            lognDesc: string

        }
        objectPolicies:{
            chkInOut:[
                {hour:number, minutes:number}, //chkin
                {hour:number, minutes:number} //chkout
                ]
            smoking: boolean,
            rules: string,
            cancellation:[ 
                 {
                    pLength: number,
                    percent: number
                }//...
            ],
            other1: string,
            other2: string //...

        }
        unitData:{
            unid:{
                name: string,
                type: string, //maybe number 1:room, 2: studio, 3: appartment
                size: number, //m2
                floor: number,
                disabledAccess: boolean,
                separateEntrance: boolean,
                view: boolean,
                elevator: boolean,
                kitchen:{
                    stove: boolean,
                    oven: boolean,
                    refrigerator: boolean,
                    microwave: boolean,
                    kitchenware: boolean,
                    electricKettle: boolean,
                    espresso: boolean,
                    dishwasher: boolean,
                    other1: string,
                    other2: string //...
                },
                bathroom:{
                    wc: number, //number of wc-s
                    bathrooms:{
                        bkey: { bathtubType }, //
                        }
                    other1: string,
                    other2: string //...

                    },
                hvac:{
                    central: boolean,
                    floor: boolean,
                    wood: boolean,
                    electricalHeater: boolean,
                    kamin: boolean,
                    ac: number, // price in euro; price=0 => ac included in price
                    ventilation: boolean,
                    other1: string,
                    other2: string //...
                },
                multimedia:{
                    tv: {
                        flatscreen: boolean,
                        cable: boolean,
                        localTV: boolean,
                        satellite: boolean,
                        other1: string,
                        other2: string //...
                    }
                    radio: {
                        radio: boolean,
                        hifi: boolean,
                        other1: string,
                        other2: string //...
                    },
                    other: {
                        projector: boolean,
                        proffessionalAudio: boolean,
                        other1: string,
                        other2: string //...
                      }
                }
            },
            equipment:{
                dryer: boolean,
                washingMachine: boolean,
                iron: boolean,
                linen: boolean,  
                towels: boolean,
                safe: boolean,
                cot: boolean, //crib, djecji krevetic
                other1: string,
                other2: string //...
            }
        }
        unitPrices:{
            unid:{
                price1: { //priceOBj
                    start: number,
                    end: number,
                    price: number,
                    minStay: number
                },
                price2: { priceObj } //...
            }
        },
        priceOverrides:{
            unid: { priceObj }
        }
    }
}
