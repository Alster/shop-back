import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { EnvironmentVariables } from './environment-variables';

export class AppConfig<T extends object> {
  protected static readonly logger: Logger = new Logger(AppConfig.name);
  protected readonly v: T;
  public readonly env: string;

  constructor(cls: ClassConstructor<T>) {
    const [config, env] = this.loadConfig(cls);
    this.v = config;
    this.env = env;
  }

  public get(): T {
    return this.v;
  }

  public isTest(): boolean {
    return process.env['NODE_ENV'] == 'test';
  }

  public isProd(): boolean {
    return process.env['NODE_ENV'] == 'production';
  }

  private loadConfig(cls: ClassConstructor<T>): [T, string] {
    const env = process.env['NODE_ENV'] || 'local';
    const configDir = process.cwd();

    const defaultFilePath = path.join(configDir, `config/default.json`);
    const defaultConfig = fs.existsSync(defaultFilePath)
      ? JSON.parse(fs.readFileSync(defaultFilePath, 'utf8'))
      : {};

    const envFilePath = path.join(configDir, `config/${env}.json`);
    AppConfig.logger.log(`Loading environment from ${envFilePath}`);
    const envConfig = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));

    const combinedConfig = { ...defaultConfig, ...envConfig };

    if (this.isTest()) {
      const testPort = (4000 + Math.ceil(Math.random() * 999)).toString();
      AppConfig.logger.log('-=*TEST*=-');
      combinedConfig['port'] = testPort;
    }
    const classConfig = plainToClass(cls, combinedConfig, {
      enableImplicitConversion: true,
    });

    // if (!this.isProd()) {
    AppConfig.logger.log(JSON.stringify(classConfig, null, 2));
    // }

    const errors = validateSync(classConfig);
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return [classConfig, env];
  }
}

const Config = new AppConfig(EnvironmentVariables);
export { Config };
