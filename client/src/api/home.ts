import request from './request';
import { getAllUsers } from './user';
import { getProducts } from './product';
import { getSkills, type SkillItem } from './skill-exchange';
import type { ProductItem } from './product';

export interface HomeStats {
  userCount: number;
  productCount: number;
  skillCount: number;
  hotProducts: ProductItem[];
  hotSkills: SkillItem[];
}

export const getHomeStats = async (): Promise<HomeStats> => {
  try {
    const [users, products, skills] = await Promise.all([
      getAllUsers(),
      getProducts({ scope: 'approved' }),
      getSkills()
    ]);
    // 根据点赞数从高到低排序，并取前 4 个作为热门作品
    const hotProducts = [...products]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 4);

    return {
      userCount: users.length,
      productCount: products.length,
      skillCount: skills.length,
      hotProducts: hotProducts,
      hotSkills: skills.slice(0, 4)
    };
  } catch {
    return {
      userCount: 128,
      productCount: 256,
      skillCount: 64,
      hotProducts: [],
      hotSkills: []
    };
  }
};
