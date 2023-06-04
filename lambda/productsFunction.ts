import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import { DynamoDB } from "aws-sdk"
import {v4 as uuid } from "uuid"

const productDbd = process.env.PRODUCT_DBD!
const ddbClient = new DynamoDB.DocumentClient()

interface Product {
    id: string;
    productName: string;
    code: string;
    price: number;
    model: string;
}

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{

    const method =  event.httpMethod
    const apiRequestId = event.requestContext.requestId
    const lambdaRequestId = context.awsRequestId

    console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`)

    if (event.resource === '/products') {
        
        if (method === 'GET') {
            console.log("GET /products")

            const products = await getAllProducts()

            return {
                statusCode: 200,
                body: JSON.stringify(products)
            }
        } else if (method === 'POST') {
            console.log("POST /products")

            const product = JSON.parse(event.body!) as Product
            const productCreated = await create(product)
            return {
                statusCode: 201,
                body: JSON.stringify(productCreated)
            }

        }
    } else if (event.resource === '/products/{id}') {

        const productId = event.pathParameters!.id!

        if (method === 'GET') {
            console.log(`GET /products/${productId}`)
            try{
                const product = await getProductById(productId)
                return {
                    statusCode: 200,
                    body: JSON.stringify(product)
                }
            } catch (error) {
                console.error((<Error>error).message)
                return {
                    statusCode: 404,
                    body: (<Error>error).message
                }
            }
        } else if (method === 'PUT') {
            console.log(`PUT /products/${productId}`)
            try{
                const product = JSON.parse(event.body!) as Product
                const productUpdated = await updateProduct(productId, product)
                return {
                    statusCode: 200,
                    body: JSON.stringify(productUpdated)
                }
            } catch (ConditionalCheckFailedException) {
                return {
                    statusCode: 404,
                    body: "Product not found"
                }
            }
        } else if (method === 'DELETE') {
            console.log(`DELETE /products/${productId}`)
            try {
                const product = await deleteProduct(productId)
                return {
                    statusCode: 200,
                    body: JSON.stringify(product)
                }
            } catch (error) {
                console.error((<Error>error).message)
                return {
                    statusCode: 404,
                    body: (<Error>error).message
                }
            }
            
        } 
    }

    return {
        statusCode: 400,
        headers: {},
        body:JSON.stringify({
            message: "Bad request"
        })
    }

}

async function getAllProducts(): Promise<Product[]> {
    const data = await ddbClient.scan({
        TableName: productDbd
    }).promise()
    return data.Items as Product[]
}

async function getProductById(productId: string): Promise<Product> {
    const data  = await ddbClient.get({
        TableName: productDbd,
        Key: {
            id: productId
        }
    }).promise()
    if (data.Item) {
        return data.Item as Product
    } else {
        throw new Error("Product not found")
    }
}

async function create(product: Product): Promise<Product> {
    product.id = uuid()
    await ddbClient.put({
        TableName: productDbd,
        Item: product
    }).promise()
    return product
} 

async function deleteProduct(productId: string): Promise<Product> {
    const data = await ddbClient.delete({
        TableName: productDbd,
        Key: {
            id: productId
        },
        ReturnValues: "ALL_OLD"
    }).promise()
    if (data.Attributes) {
        return  data.Attributes as Product
    } else {
        throw new Error("Product not found")
    }
}

async function updateProduct(productId: string, product: Product): Promise<Product> {
    const data = await ddbClient.update({
        TableName: productDbd,
        Key: {
            id: productId
        },
        ConditionExpression: "attribute_exists(id)",
        UpdateExpression: "set productName = :n, code = :c, price = :p, model = :m",
        ExpressionAttributeValues: {
            ":n": product.productName,
            ":c": product.code,
            ":p": product.price,
            ":m": product.model
        },
        ReturnValues: "UPDATED_NEW"
    }).promise()
    data.Attributes!.id = productId
    return data.Attributes as Product
}