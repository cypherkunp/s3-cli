import Conf from 'conf';

const config = new Conf();

interface ConfigurationType {
  accessId: string;
  secretKey: string;
  bucket: string;
}

export function getConfig(profileName = 'default'): ConfigurationType {
  return config.get(profileName) as ConfigurationType;
}

export function setConfig(
  profileName = 'default',
  configurations: ConfigurationType
) {
  return config.set(profileName, configurations);
}
