interface Category {
  name: string;
  url: string;
}

interface Product {
  title: string;
  url: string;
  price: string;
}

interface Data {
  categories: Category[];
  products: Product[];
}