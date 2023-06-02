const { CacheClient, Configurations, CredentialProvider } = require('@gomomento/sdk');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secrets = new SecretsManagerClient();
let cacheClient;

exports.handler = async (event) => {
  await initializeCacheClient();

  const order = {
    drink: event.detail.drinkOrder.drink,
    modifiers: event.detail.drinkOrder.modifiers.join(',')
  };

  await cacheClient.dictionarySetFields('serverlesspresso', event.detail.orderId, order);
};

const initializeCacheClient = async () => {
  if (!cacheClient) {
    const authToken = await getSecret('momento');

    cacheClient = new CacheClient({
      configuration: Configurations.Laptop.latest(),
      credentialProvider: CredentialProvider.fromString({ authToken }),
      defaultTtlSeconds: Number(process.env.CACHE_TTL)
    });
  }
};

const getSecret = async (secretKey) => {
  const response = await secrets.send(new GetSecretValueCommand({ SecretId: process.env.SECRET_ID }));
  if (response) {
    cachedSecrets = JSON.parse(response.SecretString);
    return cachedSecrets[secretKey];
  }
};