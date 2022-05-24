// This code was strongly inspired from @trpc/server
import { httpError } from '../../Errors';
import { AbstractHandler, Handler } from '../handler';

type YupParser<T = any> = { validateSync: (input: unknown) => T };
type SuperstructParser<T = any> = { create: (input: unknown) => T };
type ZodParser<T = any> = { parse: (input: any) => T };

export type DataParser<T = any> = YupParser<T> | ZodParser<T> | SuperstructParser<T>;

export type InferDataParser<Val extends DataParser> = Val extends DataParser<infer Output> ? Output : any;

/**
 *
 */
export class DataValidator<Output = any> extends AbstractHandler {
  public output!: Output;

  constructor(private parser: DataParser<Output>, private dataToValidate: 'body' | 'query' | 'headers') {
    super();
  }

  private isYupParser = (parser: any): parser is YupParser => typeof parser.validateSync === 'function';

  private isSuperstructParser = (parser: any): parser is SuperstructParser => typeof parser.create === 'function';

  private isZodParser = (parser: any): parser is ZodParser => typeof parser.safeParse === 'function';

  public handle: Handler['handle'] = async (data) => {
    try {
      if (this.isYupParser(this.parser)) this.parser.validateSync(data[this.dataToValidate]);
      else if (this.isZodParser(this.parser)) this.parser.parse(data[this.dataToValidate]);
      else if (this.isSuperstructParser(this.parser)) this.parser.create(data[this.dataToValidate]);

      return super.handle(data);
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