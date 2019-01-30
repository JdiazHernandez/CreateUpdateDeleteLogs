const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: '<PROJECT_ID>',
    keyFilename: './firebase-Keyfile.json', //<= Firebase keys file .json
});

function createUpdate(snap, context, isNew) {

    var a = context.params.id1;
    var b = context.params.id2;
    var logsToDbPath = 'logs/' + a + "_" + b;

    if (isNew) {
        var userID = snap.data().createdBy;
        var logsObject = {
            content: snap.data().content || "noContet",
            createdAt: snap.data().createdAt.toDate(),
            createdBy: snap.data().createdBy,
            companyId: b,
        };
    } else {
        var userID = snap.after.data().createdBy;
        var logsObject = {
            content: snap.after.data().content || "noContet",
            createdAt: snap.after.data().createdAt.toDate(),
            createdBy: snap.after.data().createdBy,
            companyId: b,
        };
    }

    var dbcreate = db.doc(logsToDbPath).set(logsObject);

    var userPath = `users/` + userID;
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

    var companyPath = 'clients/' + a;
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
}

exports.createLog = functions.firestore
    .document('clients/{id1}/logs/{id2}')
    .onCreate((snap, context) => {
        var isNew = true;
        console.log("CREATING A NEW LOG POST!")
        return createUpdate(snap, context, isNew)
    })

exports.updateLog = functions.firestore
    .document('clients/{id1}/logs/{id2}')
    .onUpdate((snap, context) => {
        var isNew = false;
        console.log("YOU HAVE UPDATE A LOG !")
        return createUpdate(snap, context, isNew)
    })

exports.deleteLog = functions.firestore
    .document('clients/{id1}/logs/{id2}')
    .onDelete((snap, context) => {
        var logsToDbPath = 'logs/' + context.params.id1 + "_" + context.params.id2;
        var deletLog = db.doc(logsToDbPath).delete()
        return console.log("DELETING " + logsToDbPath)
    })