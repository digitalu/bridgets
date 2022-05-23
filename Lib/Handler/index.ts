import { Method } from '../Routes';
import {
  Validator,
  MethodValidator,
  MiddlewareValidator,
  FilesConfig,
  FilesValidator,
  BridgeValidator,
  BridgeParser,
} from '../Validators';

export class Handler<Resolve extends (...args: any[]) => any, Middlewares extends Readonly<Handler<any, any>[]>> {
  public isBridgeHandler = true;

  public resolve: Resolve;
  public validator: Validator;
  public description?: string;
  public method: Method;
  public filesConfig?: FilesConfig;
  public bodySchema?: BridgeParser;
  public querySchema?: BridgeParser;
  public headersSchema?: BridgeParser;

  public constructor(p: {
    resolve: Resolve;
    bodySchema?: BridgeParser;
    querySchema?: BridgeParser;
    headersSchema?: BridgeParser;
    filesConfig?: FilesConfig;
    method: Method;
    middlewares?: Middlewares;
    description?: string;
  }) {
    this.resolve = p.resolve;

    if (p.method === 'GET' && p.bodySchema) throw new Error("You can't have a body with a GET endpoint.");
    if (p.bodySchema && p.filesConfig) throw new Error("You can't get a JSON body and files in the same endpoint.");

    const firstValidator: Validator = new MethodValidator(p.method);
    let validator = firstValidator;

    if (p.bodySchema) validator = validator.setNext(new BridgeValidator(p.bodySchema, 'body'));
    if (p.querySchema) validator = validator.setNext(new BridgeValidator(p.querySchema, 'query'));
    if (p.headersSchema) validator = validator.setNext(new BridgeValidator(p.headersSchema, 'headers'));
    if (p.filesConfig) validator = validator.setNext(new FilesValidator(p.filesConfig));
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
