export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export type Website = {
  id: number;
  name: string;
  slug: string;
  description: string;
  url: string;
  logo: string;
  category: Category;
  is_featured: boolean;
};
