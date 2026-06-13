import Image from "next/image";
import { CartItem } from "@/types";

interface Props {
  item: CartItem;
}

// {
//     "id": 162,
//     "title": "Blue Frock",
//     "price": 29.99,
//     "quantity": 4,
//     "total": 119.96,
//     "discountPercentage": 12.13,
//     "discountedTotal": 105.41,
//     "thumbnail": "https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp"
// }

export function CartItemCard({ item }: Props) {
    
  return (
    <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-white/5">
      <div className="relative w-20 h-20">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-violet-400 font-bold">${item.price}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* هنا هتحط الـ Buttons بتاعة الـ + والـ - لاحقاً */}
        <span className="bg-slate-700 px-3 py-1 rounded-md">
          الكمية: {item.quantity}
        </span>
        <button className="text-red-400 hover:text-red-300">حذف</button>
      </div>
    </div>
  );
}
