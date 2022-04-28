import HttpException from "./HttpException";

export default class ProductNotFoundException extends HttpException {
  constructor(id: string | number) {
    super(404, `Product with id ${id} not found`);
  }
}
