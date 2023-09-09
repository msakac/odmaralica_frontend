import { ILogEncryptedGetDTO } from 'types/log.types';
import CryptoJS from 'crypto-js';

function decryptLogData(encryptedObj: ILogEncryptedGetDTO, encryptedBase64Key: string): ILogEncryptedGetDTO | null {
  const decryptedObj: ILogEncryptedGetDTO = {} as ILogEncryptedGetDTO;
  //   const encryptedBase64Key = 'aXRzaG91bGRiZTE2Y2hcg=';
  const parsedBase64Key = CryptoJS.enc.Base64.parse(encryptedBase64Key);
  try {
    Object.keys(encryptedObj).forEach((prop) => {
      const key = prop as keyof ILogEncryptedGetDTO; // Type assertion
      const decryptedData = CryptoJS.AES.decrypt(encryptedObj[key], parsedBase64Key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      const decryptedDataString = decryptedData.toString(CryptoJS.enc.Utf8);
      decryptedObj[key] = decryptedDataString;
    });
  } catch (e) {
    return null;
  }

  return decryptedObj;
}

export default decryptLogData;

// // aXRzaG91bGRiZTE2Y2hhcg==

/*
POST /auth/login -> everyone
POST /auth/login-open-auth -> everyone
POST /auth/register -> everyone
POST /auth/activate -> everyone
ALL METHODS /role -> admin
GET /user -> admin, moderator
GET /user/:id -> user, moderator, renter, admin
POST /user -> admin
DELTE /user/:id -> admin
PUT /user/:id -> user, moderator, renter, admin
GET /accommodation-unit -> everyone
GET /accommodation-unit/:id -> everyone
GET /accommodation-unit/find -> everyone
POST /accommodation-unit -> admin, moderator, renter
DELETE /accommodation-unit/:id -> admin, moderator, renter
PUT /accommodation-unit -> admin, moderator, renter
ALL METHODS /activity-type -> admin
POST /address -> admin, moderator, renter
PUT /address -> admin, moderator, renter
DELETE /address/:id -> admin, moderator, renter
GET /address -> everyone
GET /address/:id -> everyone
GET /address/find -> everyone
POST /amount -> admin, moderator, renter
PUT /amount -> admin, moderator, renter
DELETE /amount/:id -> admin, moderator, renter
GET /amount -> everyone
GET /amount/:id -> everyone
GET /amount/find -> everyone
POST /city -> admin
PUT /city -> admin
DELETE /city/:id -> admin
GET /city -> everyone
GET /city/:id -> everyone
GET /city/find -> everyone
POST /country -> admin
PUT /country/:id -> admin
DELETE /country/:id -> admin
GET /country -> everyone
GET /country/:id -> everyone
GET /country/find -> everyone
GET /country/with-regions-and-cities -> everyone
POST /image -> user, moderator, renter, admin
GET /image/:id -> everyone
GET /image/find -> everyone
DELETE /image/:id -> user, moderator, renter, admin
DELETE /image/:type/:id -> user, moderator, renter, admin
GET /log -> admin
GET /log/encrypted -> admin
POST /price-period -> admin, moderator, renter
PUT /price-period -> admin, moderator, renter
DELETE /price-period/:id -> admin, moderator, renter
GET /price-period -> everyone
GET /price-period/:id -> everyone
GET /price-period/find -> everyone
POST /region -> admin
PUT /region -> admin
DELETE /region/:id -> admin
GET /region -> everyone
GET /region/:id -> everyone
GET /region/find -> everyone
POST /reservation -> user, moderator, renter, admin
PUT /reservation -> user, moderator, renter, admin
DELETE /reservation/:id -> user, moderator, renter, admin
GET /reservation -> everyone
GET /reservation/:id -> everyone
GET /reservation/find -> everyone
POST /residence -> moderator, renter, admin
PUT /residence -> moderator, renter, admin
DELETE /residence/:id -> moderator, renter, admin
GET /residence -> everyone
GET /residence/:id -> everyone
GET /residence/find -> everyone
GET /residence/aggregate -> everyone
GET /residence/aggregate/:id -> everyone
POST /residence-type -> admin
PUT /residence-type -> admin
DELETE /residence-type/:id -> admin
GET /residence-type -> everyone
GET /residence-type/:id -> everyone
GET /residence-type/find -> everyone
POST /review -> user, moderator, renter, admin
PUT /review -> user, moderator, renter, admin
DELETE /review/:id -> user, moderator, renter, admin
GET /review -> everyone
GET /review/:id -> everyone
GET /review/find -> everyone
GET /review/can-review/:userId/:residenceId

*/
