# Cloud function app

## How it should work

The data base contains two sets of collections:
* client/ID/log/ID/Information
* logs/ID/Information

The function should react to any new changes on the first set and copy most of the information to the second.

## Database original structure:

* client/{`ID1`}/log/{`ID2`}/
    - content: "content of a log"
    - createdAt: "[date field]"
    - createdBy: "<ID_of_the_User>" (`ID3`)
* client/{`ID1`}
    - companyName:"name"
* users/{`ID3`}
    - name: "Name"
    - img: "image"

## Results expected

* logs/{`ID1_ID2`}/
    - content: "content of a log"
    - createdAt: "[date field]"
    - createdBy: "F0jx5G0AHxYMtVGJ6UmPo2N0NoC3" (`ID3`)
    - createdByName: "Paweł"       <--- this we will taken from users collection(`ID3`->Related)
    - createdByImg: image           <--- this we will taken from users collection(`ID3`->Related)
    - companyId: "<COMPANY_ID>"  <--- this we will taken from parent collection `.key` (`ID1`)
    - companyName: "Company Name"  <--- this we will taken from parent collection - there's an element `name`


## Pseudo action:

* New log is created on the client collection:
    * client/ID2/log/`newID2`/ `NewlogInformation`
* Function start on `update` / `creation`
* The function retrieves:
    * Log information:
        * Createdby: (ID3) `client/id1/log/id2/createby`
        * dateOfCreation: (Date) `client/id1/log/id2/createdat`
        * Content: (string) `client/id1/log/id2/content`
        * ClientID: (ID1) `client/id1`
        * ClientName: (string) `client/id1/name`
        * CreatedByImg: (url)
        * CreatedByName: (string) `users/id3/name`
* Everything is stored in log collection on root.
* The logID  is `<The clientID>_<The logID in the client db>`
* End of the function.

## License

MIT

## Author

JDwebDev


