import { SystemConfigurationEnum } from './../enum/system-configuration.enum';
export class ConfigurationProvider {
    public provide(configName: SystemConfigurationEnum): string {
        return process.env[configName];
    }
}