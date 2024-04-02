import admin from 'firebase-admin';

// Load the service account key JSON file


// Initialize Firebase Admin SDK on the server side
const initializeFirebaseServer = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "medemaa-495d8",
        "private_key_id": "e3c32d9e8995dd8924c55189cb48c8ca73422189",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCW0RZu4WpOlsk/\nNMBEyiH+AsRNuBccVm943HvTjp1kICEr4Ts5PC9yjLo87WjJEUTE2Yc/R8D24u23\ncssxXJdTYFks7Kzwavcfo+z7m508pwGnF73ENckotEtmLtRE7eykxKtUU5Up0E1V\nGdLFVmlDqguYJbE7t+SeM7P0E/96+nkLuC//MTIZS/HEJgFNw6XXqqN10qRykid0\npPtwq2ZYpsIcdZ8QCXrYwWRNx/WERFtlbx/SVzhWvP2BqK4XhS4lMLa0S0GZgmEH\nm55uvku/YQSjVYcNmB98MoYqK11EqOG3bzmhA8eVCxBCoWd1AD1ytFsVoSZgCrL+\n/zGBaA5DAgMBAAECggEAO63qeB8ID6g4Y6QOr0njUJ4squp9bq+/da6d61Xkb0IN\njk0Wv+vShLwuWDzD+ci1E0ZW8BIHSEr9MVoiENroYMxgDVhsiMhzGNinxtrJyj31\n9/Z7l+CGxO4vZfSC9/HEcmEGwRxACudMKrBIyOEMT4PDCcZkj1KSC44/GAcv0iwe\nhqV5F8EEvCizPqvgPM2RzPZOSqZbcrZN0fgJ2a+87MGzLfgbdR+EwKak4fvdbsXt\nKvKlGvXFuJ0yE3jZTd573IF6zYkejJBTHrChxWksd/2yhL+3GxczHgDl6xQL9ypI\nzuJ57WCWxkHTDixpEaZNtPJb2JeXHkue676BjO+KVQKBgQDSob76JyxO4i6ULw3e\n5xqS9A3fM7gTh9KpdkGobFmbcKi2Ba0PIKkvnH/YNsFPAShGXISxy5OhDb4Lfi9N\nHxAecv4UYIqM6l22SdBJYW9WTjGphy2RWPekq8fB0F5Mem+Pi9payiTfawkJvAhT\nwrAQKT44GedAjrFltluDDXR4lwKBgQC3TSJaGqtxYaf5zbSgaaI2TrD8Vo0IrRf7\n6R3TkymqDJ+4v34keQNqQ7M52FhWTPszfAIdni1/20LiJ0xWeZ8pGuzQyCWwfKwI\nHCH9HLfeRvppGSmp/mwmPms7UjcYCJB0w01aoM9RhejhRCTeT7gJC+wpQxKFZmUP\nwG87VpGBNQKBgC957cYM1lvhd4ZHJOU9SiwdfpL04WTllIJF+X6xDXGP7zc4CE4E\nmp30tIxTqzbXl/BkIjTBIkGHC3Mjuh20BroWSVbme9RPb1gLQzuHDsVxUphXs9mz\nJ/6iCaCSCu9KGaNNbqZQMgd55Mug6m+WzoCWC0Qx8oIGp825UN81RS95AoGARKib\nyWxb82hE5wjqM3vdysHHAX3Z7foIFc/H4EwrOwrneOghc7/wS4l4RJ6I2CqVnT9B\n+54YJOAYOWXG7k04FMmFEt8lXuoT9iWzhX+QT63+dgd617X5BIo02E9/W305vsK4\n4s2BWmPySw6fULZDlP/mQb5h3Z3xFOlbwLo4XlECgYEAiUF+CndKETZWxvO6IkUo\nH2P9SunNp7BidwXPTVNlcx/YhccucHIA0orl6TQ3iSIhpnIzI0cKn4qXn2dARRp3\nb0D1jbdJ6nFz4evpNEU8ECwH8Fnvzukf5WuxINc3BNgpB7j+YvoWi1SRdA91JJK5\nllmJiJNza03mIxEDAMNFVgo=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-itomv@medemaa-495d8.iam.gserviceaccount.com",
        "client_id": "110771702009098509632",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-itomv%40medemaa-495d8.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
      }),
      // Add other configurations as needed
    });
  }
  return admin;
};

export default initializeFirebaseServer;
