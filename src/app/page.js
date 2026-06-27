import Banner from "@/components/Banner";
import BookSection from "@/components/books/BookSection";
import PopularCategories from "@/components/PopularCategories";
import TopLibrarians from "@/components/TopLibrarians";
import WhyChooseUs from "@/components/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner />
      <BookSection />
      <TopLibrarians />
      <PopularCategories />
      <WhyChooseUs />

    </div>
  );
}
