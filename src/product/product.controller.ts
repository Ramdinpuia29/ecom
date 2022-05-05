import { validate } from "class-validator";
import { Request, Response, NextFunction, Router } from "express";
import { Like } from "typeorm";
import ProductNotFoundException from "../common/exceptions/ProductNotFoundException";
import IController from "../common/interfaces/controller.interface";
import { AppDataSource } from "../data-source";
import CreateProductDto from "./product.dto";
import { IProduct } from "./product.interface";
import Product from "./product.model";

export default class ProductController implements IController {
  public path = "/products";
  public router = Router();
  private product = AppDataSource.getRepository(Product);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path).get(this.getAllProducts).post(this.addProduct);
    this.router
      .route(`${this.path}/:id`)
      .get(this.getProductById)
      .put(this.editProduct)
      .delete(this.deleteProduct);
  }

  private getAllProducts = async (req: Request, res: Response) => {
    const query = req.query;
    const take = (query.take as unknown as number) || 10;
    const skip = (query.skip as unknown as number) || 0;

    const products = await this.product.find({
      where: { brand: Like(`%${query.keyword}%`) },
      order: { createdAt: "DESC" },
      take,
      skip,
    });

    res.status(200).json({
      responseCode: res.statusCode,
      responseData: products,
      responseMessage: `${products.length} product(s) fetched successfully`,
    });
  };

  private getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = parseInt(req.params.id);
    const product = await this.product.findOneBy({ id });

    if (product) {
      res.json({
        responseCode: res.statusCode,
        responseData: product,
        responseMessage: `Product with id: ${id}`,
      });
    } else {
      next(new ProductNotFoundException(id));
    }
  };

  private addProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const productData: CreateProductDto = req.body;

    validate(productData);

    const addedProduct = await this.product.save(productData);

    res.status(201).json({
      responseCode: res.statusCode,
      responseData: addedProduct,
      responseMessage: `Product with id: ${addedProduct.id} added successfully`,
    });
  };

  private editProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = parseInt(req.params.id);
    const productData: IProduct = req.body;

    const updatingProduct = await this.product.findOneBy({ id });

    if (!updatingProduct) {
      next(new ProductNotFoundException(id));
    }

    const updatedProduct = await this.product.save({
      ...updatingProduct,
      ...productData,
    });

    if (updatedProduct) {
      res.status(200).json({
        responseCode: res.statusCode,
        responseData: updatedProduct,
        responseMessage: `Product with id: ${id} has been updated`,
      });
    }
  };

  private deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = parseInt(req.params.id);

    const product = await this.product.findOneBy({ id });

    if (!product) {
      next(new ProductNotFoundException(id));
    }

    const deletedProduct = await this.product.delete({ id });

    if (deletedProduct) {
      res.status(200).json({
        responseCode: res.statusCode,
        responseData: deletedProduct,
        responseMessage: `Product with id: ${id} has been deleted`,
      });
    }
  };
}
