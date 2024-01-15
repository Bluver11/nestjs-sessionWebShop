import { Controller, Get, Param, Post, Render, Session } from '@nestjs/common';
import * as mysql from 'mysql2';
import { AppService } from './app.service';

const conn = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'database',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private products = [
    { id: 1, nev: 'Körte', ar: 10 },
    { id: 2, nev: 'Alma', ar: 20 },
    {id:3, nev:'Eper',ar: 20},
    {id:4,nev:"Banán",ar:100}
    
  ];

  
  @Get()
  @Render('index')
  async getProducts(@Session() session: Record<string,any>) {
    const cartItems = session.cart || [];
    const productsInCart = this.products.filter(product => cartItems.includes(product.id));
    //const total = productsInCart.reduce((sum, cartItem) => sum + productsInCart.products.price, 0);

    return { products:this.products, cartItems, productsInCart };
  }
  @Get('cart/add/:id')
  async addToCart(@Param('id') productId: string, @Session() session:  Record<string,any>) {
    const productIdNumber = parseInt(productId, 10);

    if (!session.cart) {
      session.cart = [];
    }

    session.cart.push(productIdNumber);

    return { redirect: '' };
  }
 
}
