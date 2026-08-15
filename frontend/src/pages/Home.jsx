import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchFeaturedProducts, fetchBestSellers } from '../redux/slices/productSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import HeroSection from '../components/home/HeroSection';
import TrustBar from '../components/home/TrustBar';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryShowcase from '../components/home/CategoryShowcase';
import ProductCarousel from '../components/home/ProductCarousel';
import WhyChooseUs from '../components/home/WhyChooseUs';
import HowItWorks from '../components/home/HowItWorks';
import PromotionalBanner from '../components/home/PromotionalBanner';
import FinalCTA from '../components/home/FinalCTA';

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, featured, bestSellers } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ page: 1, limit: 8, sort: '-createdAt' }));
    dispatch(fetchFeaturedProducts(8));
    dispatch(fetchBestSellers(8));
  }, [dispatch]);

  const featuredProducts = featured.length > 0 ? featured : products.slice(0, 4);
  const trendingProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 6);

  return (
    <main className="bg-[#f9fafb]">
      <HeroSection products={products} />
      <TrustBar />
      <FeaturedProducts
        title="Popular Picks"
        subtitle="Products customers are loving right now."
        products={featuredProducts}
      />
      <CategoryShowcase categories={categories} />
      <ProductCarousel
        title="Trending Now"
        subtitle="Fresh favorites and everyday essentials built for modern life."
        products={trendingProducts}
      />
      <WhyChooseUs />
      <HowItWorks />
      <PromotionalBanner />
      <FinalCTA />
    </main>
  );
};

export default Home;
