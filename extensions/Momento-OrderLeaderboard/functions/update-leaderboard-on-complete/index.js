const { CacheClient, Configurations, CredentialProvider } = require('@gomomento/sdk');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secrets = new SecretsManagerClient();
let cacheClient;

exports.handler = async (event) => {
  await initializeCacheClient();

  //save drink to a leaderboard
  //increment each modifier to the leaderboard
  //calculate drink creation time and update leaderboard
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