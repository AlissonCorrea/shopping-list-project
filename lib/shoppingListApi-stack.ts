import * as  cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"


interface ShoppingListApiStackProps extends cdk.StackProps {
    productsHandler: lambdaNodeJS.NodejsFunction
}

export class ShoppingListApiStack extends cdk.Stack {

    constructor (scope: Construct, id: string, props: ShoppingListApiStackProps) {
        super(scope, id, props)

         const  api = new apigateway.RestApi(this, "shopping-list-api", {
            restApiName: "Shopping List Service"
         })

         const productsIntegration = new apigateway.LambdaIntegration(props.productsHandler)
         
         const productsResource = api.root.addResource("products")
         productsResource.addMethod("GET", productsIntegration)
         productsResource.addMethod("POST", productsIntegration)
         
         const productIdResource = productsResource.addResource("{id}")
         productIdResource.addMethod("GET", productsIntegration)
         productIdResource.addMethod("PUT", productsIntegration)
         productIdResource.addMethod("DELETE", productsIntegration)
    }
        
}