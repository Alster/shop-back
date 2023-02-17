import {
  IsBooleanString,
  IsEnum,
  IsNumber,
  IsPort,
  IsString,
  IsUrl,
} from 'class-validator';

export class MongoConfig {
  @IsUrl()
  readonly url!: string;
}

export class EnvironmentVariables {
  @IsPort()
  readonly port!: string;
  readonly mongo!: MongoConfig;
}
