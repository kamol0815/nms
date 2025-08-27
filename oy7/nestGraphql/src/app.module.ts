import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductResolver } from './product/product.resolver';
import { ProductService } from './product/product.service';
import { CategoryResolver } from './category/category.resolver';
import { CategoryService } from './category/category.service';
import { SalesResolver } from './sales/sales.resolver';
import { SalesService } from './sales/sales.service';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
        }),
    ],
    providers: [
        ProductResolver,
        ProductService,
        CategoryResolver,
        CategoryService,
        SalesResolver,
        SalesService,
    ],
})
export class AppModule { }
