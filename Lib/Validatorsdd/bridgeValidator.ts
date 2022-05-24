// This code was strongly inspired from @trpc/server
import { httpError } from '../Errors';
import { AbstractValidator, ValidateFN } from './validator';

type YupParser<T = any> = { validateSync: (input: unknown) => T };
type SuperstructParser<T = any> = { create: (input: unknown) => T };
type ZodParser<T = any> = { parse: (input: any) => T };

export type BridgeParser<T = any> = YupParser<T> | ZodParser<T> | SuperstructParser<T>;

export type InferBridgeParser<Val extends BridgeParser> = Val extends BridgeParser<infer Output> ? Output : any;

export class BridgeValidator<Output = any> extends AbstractValidator {
  public output!: Output;

  constructor(private parser: BridgeParser<Output>, private dataToValidate: 'body' | 'query' | 'headers') {
    super();
  }

  private isYupParser = (parser: any): parser is YupParser => typeof parser.validateSync === 'function';

  private isSuperstructParser = (parser: any): parser is SuperstructParser => typeof parser.create === 'function';

  private isZodParser = (parser: any): parser is ZodParser => typeof parser.safeParse === 'function';

  public validate: ValidateFN = async (req, data) => {
    try {
      if (this.isYupParser(this.parser)) this.parser.validateSync(req[this.dataToValidate]);
      else if (this.isZodParser(this.parser)) this.parser.parse(req[this.dataToValidate]);
      else if (this.isSuperstructParser(this.parser)) this.parser.create(req[this.dataToValidate]);

      return super.validate(req, data);
    } catch (error) {
      switch (this.dataToValidate) {
        case 'body':
          return httpError('Unprocessable entity', `Body schema validation error`, error);
        case 'query':
          return httpError('Unprocessable entity', `Query schema validation error`, error);
        case 'headers':
          return httpError('Unprocessable entity', `Headers schema validation error`, error);
      }
    }
  };
}
