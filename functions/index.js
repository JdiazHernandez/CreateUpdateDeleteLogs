const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: '<PROJECT_ID>',
    keyFilename: './firebase-Keyfile.json', //<= Firebase keys file .json
});

exports.rewriteLog = functions.firestore
    .document('clients/{id1}/logs/{id2}')
    .onCreate((snap, context) => {
        
        console.log("CREATING A NEW LOG POST!")
        var id1 = context.params.id1;
       // console.log("id1= " + id1)
        var id2 = context.params.id2;
       // console.log("id2= " + id2)
        var userID = snap.data().createdBy;
       // console.log("user id= " + userID)

        var logsId = id1 + "_" + id2;
        var logsToDbPath = 'logs/' + logsId

       // console.log("log id= " + logsId);

        var logsObject = {
            content: snap.data().content || "noContet",
            createdAt: snap.data().createdAt.toDate(),
            createdBy: snap.data().createdBy,
            companyId: id2,
        };

       // console.log(logsObject)
        db.doc(logsToDbPath).set(logsObject);


        var userPath = `users/` + userID;
       // console.log("userPath : " + userPath)
        var searchDbforuser = db.doc(userPath)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                } else {
                    logsObject.createdByName = doc.data().name;
                    logsObject.createbByImg = doc.data().img;
                    let f = db.doc(logsToDbPath).set(logsObject);
                    return console.log('USer name:', doc.data().name)
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });

        var companyPath = 'clients/' + id1;
       // console.log("Company path: " + companyPath)

        var dbsearchCompanyname = db.doc(companyPath)
            .get().then(doc => {
                if (!doc.exists) {
                    console.log('No such company!');
                } else {
                    logsObject.companyname = doc.data().name;
                    let f = db.doc(logsToDbPath).set(logsObject);
                    return console.log('Company name:', doc.data().name)
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
        console.log("CREATED AND WAITING FOR THE EXTRA DATA")
    })


exports.updateLog = functions.firestore
    .document('clients/{id1}/logs/{id2}')
    .onUpdate((snap, context) => {

       // console.log("YOU HAVE UPDATE A LOG !")
        var id1 = context.params.id1;
       // console.log("id1= " + id1)
        var id2 = context.params.id2;
       // console.log("id2= " + id2)
        var userID = snap.after.data().createdBy;
       // console.log("user id= " + userID)

        var logsId = id1 + "_" + id2;
        var logsToDbPath = 'logs/' + logsId

       // console.log("log id= " + logsId);

        var logsObject = {
            content: snap.after.data().content || "noContet",
            createdAt: snap.after.data().createdAt.toDate(),
            createdBy: snap.after.data().createdBy,
            companyId: id2,
        };

       // console.log(logsObject)
        db.doc(logsToDbPath).set(logsObject);

        var userPath = `users/` + userID;
       // console.log("userPath : " + userPath)

        var searchDbforuser = db.doc(userPath)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                } else {

                    logsObject.createdByName = doc.data().name;
                    logsObject.createbByImg = doc.data().img;
                    let f = db.doc(logsToDbPath).set(logsObject);
                    return console.log('USer name:', doc.data().name)
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });

        var companyPath = 'clients/' + id1;
       // console.log("Company path: " + companyPath)

        var dbsearchCompanyname = db.doc(companyPath)
            .get().then(doc => {
                if (!doc.exists) {
                    console.log('No such company!');
                } else {
                    logsObject.companyname = doc.data().name;
                    let f = db.doc(logsToDbPath).set(logsObject);
                    return console.log('Company name:', doc.data().name)
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
        return console.log("Now there is only waiting for the promises")
    })

exports.deleteLog = functions.firestore
    .document('clients/{id1}/logs/{id2}')
    .onDelete((snap, context) => {

        var id1 = context.params.id1;
      //  console.log("id1= " + id1)
        var id2 = context.params.id2;
      //  console.log("id2= " + id2)

        var logsId = id1 + "_" + id2;

        var logsToDbPath = 'logs/' + logsId

        var deletLog = db.doc(logsToDbPath).delete()

        return console.log("DELETING " + logsId)
    })