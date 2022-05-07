import { Middleware } from '../Controller';
import { Method } from '../Routes';
import { Validator, MethodValidator, ZodValidator, MiddlewareValidator, FilesConfig } from '../Validators';
import { ZodSchema } from 'zod';

export class Endpoint<SDKHandler extends (...args: any[]) => any> {
  public isBridgeEndpoint = true;

  public handler: SDKHandler;
  public validator: Validator;
  public description?: string;
  public method: Method;
  public filesConfig?: FilesConfig;
  public bodySchema?: ZodSchema;
  public querySchema?: ZodSchema;
  public headersSchema?: ZodSchema;

  public constructor(p: {
    handler: SDKHandler;
    bodySchema?: ZodSchema;
    querySchema?: ZodSchema;
    headersSchema?: ZodSchema;
    filesConfig?: FilesConfig;
    method: Method;
    middlewares?: Readonly<Middleware[]>;
    description?: string;
  }) {
    this.handler = p.handler;

    if (p.method === 'GET' && p.bodySchema) throw new Error("You can't have a body with a GET endpoint.");
    if (p.bodySchema && p.filesConfig) throw new Error("You can't get a JSON body and files in the same endpoint.");

    const firstValidator: Validator = new MethodValidator(p.method);
    let validator = firstValidator;

    if (p.bodySchema) validator = validator.setNext(new ZodValidator(p.bodySchema, 'body'));
    if (p.querySchema) validator = validator.setNext(new ZodValidator(p.querySchema, 'query'));
    if (p.headersSchema) validator = validator.setNext(new ZodValidator(p.headersSchema, 'headers'));

    if (p.middlewares) p.middlewares.forEach((midlw) => (validator = validator.setNext(new MiddlewareValidator(midlw))));

    this.validator = firstValidator;

    this.description = p.description;
    this.method = p.method;
    this.filesConfig = p.filesConfig;
    this.bodySchema = p.bodySchema;
    this.querySchema = p.querySchema;
    this.headersSchema = p.headersSchema;
  }
}
