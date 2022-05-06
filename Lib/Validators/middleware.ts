import { Request } from 'express';
import { BridgeNextFunction } from '../Controller';
import { AbstractValidator } from './validator';

const bridgeNextFunction: BridgeNextFunction = (p) => p || ({} as any);

export class MiddlewareValidator extends AbstractValidator {
  constructor(private middleware: any) {
    super();
  }

  public async validate(req: Request, data: Record<any, any>): Promise<Record<any, any>> {
    const result = await this.middleware(req, bridgeNextFunction);

    if (result.error) return { error: result.error };

    return await super.validate(req, { ...data, ...result });
  }
}
