#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ShoppingListApiStack } from '../lib/shoppingListApi-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();

const env: cdk.Environment = {
  region: process.env.REGION,
  account: process.env.ACCOUNT
}

const tags = {
  const: "ShoppingList",
  team: "ShoppingList"
}

const productsAppStack = new  ProductsAppStack(app, "ProductsApp", {
  env: env,
  tags: tags
})

const shoppingListApiStack = new  ShoppingListApiStack(app, "Api", {
  env: env,
  tags: tags,
  productsHandler: productsAppStack.productsHandler
})

shoppingListApiStack.addDependency(productsAppStack)