export interface CategoryItem {
  id: string;
  label: string;
  desc: string;
  icon: string;
  image: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'khmer-literature', label: 'Khmer-Literature', desc: 'khmer-fiction, short stories & more',   icon: 'literature', image: 'https://i.pinimg.com/736x/b0/da/ea/b0daead3ba9804134a61307d2737c0b2.jpg' },
  { id: 'novel',            label: 'Novel',            desc: 'khmer-novel, short stories, love & more', icon: 'novel',      image: 'https://i.pinimg.com/736x/c3/b0/f4/c3b0f4d2c70607ca2d69db3cdbd20ae1.jpg' },
  { id: 'technology',       label: 'Technology',       desc: 'khmer-novel, short stories, love & more', icon: 'technology', image: 'https://i.pinimg.com/736x/f4/c0/27/f4c0271289275fe3cfdef89eb16d9f5e.jpg' },
  { id: 'science',          label: 'Science',          desc: 'Chemical, New exploration & more',        icon: 'science',    image: 'https://i.pinimg.com/736x/4d/4f/39/4d4f391c0a90625b180a182498a85ffe.jpg' },
  { id: 'fiction',          label: 'Fiction',          desc: 'Novels, short stories & more',            icon: 'fiction',    image: 'https://i.pinimg.com/736x/5c/c4/8d/5cc48da80c989e9aa5eb20e1ba4f7211.jpg' },
  { id: 'selfHelp',         label: 'Self-Help',        desc: 'Grow & improve yourself',                 icon: 'selfHelp',   image: 'https://i.pinimg.com/736x/89/3a/d6/893ad68020bb0ac7f38673363d0a7d9e.jpg' },
  { id: 'biography',        label: 'Biography',        desc: 'Real lives, real stories',                icon: 'biography',  image: 'https://i.pinimg.com/1200x/15/e1/0f/15e10fa22242765071035b8eadbdb7ce.jpg' },
  { id: 'children',         label: "Children's",       desc: 'Books for young readers',                 icon: 'children',   image: 'https://i.pinimg.com/1200x/7b/fb/48/7bfb482c8680bffc5bf3f23401725b0f.jpg' },
  { id: 'health',           label: 'Health',           desc: 'Mind & body wellness',                    icon: 'health',     image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&q=80' },
  { id: 'finance',          label: 'Finance',          desc: 'Build your wealth',                       icon: 'finance',    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&q=80' },
  { id: 'art',              label: 'Arts',             desc: 'Creativity & design',                     icon: 'art',        image: 'https://i.pinimg.com/1200x/c1/d0/2b/c1d02b69b6d275336914db687117ccbd.jpg' },
  { id: 'non-fiction',      label: 'Non-Fiction',      desc: 'Knowledge & discovery',                   icon: 'nonFiction', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop&q=80' },
];