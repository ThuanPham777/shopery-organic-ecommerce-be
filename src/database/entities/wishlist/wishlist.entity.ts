import { Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "../base.entity";
import { User } from "../user/user.entity";
import { Product } from "../product/product.entity";

@Entity({ name: 'Wishlist' })
@Unique(['user', 'product']) // Ràng buộc unique cặp user-product
export class Wishlist extends BaseEntity {
    @ManyToOne(() => User, (user) => user.wishlist)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, (product) => product.wishlist)
    @JoinColumn({ name: 'product_id' })
    product: Product
}