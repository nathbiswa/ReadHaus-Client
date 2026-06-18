import Banner from "@/components/Banner";
import BookSection from "@/components/books/BookSection";
import TopLibrarians from "@/components/TopLibrarians";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner />
      <BookSection />
      <TopLibrarians />

    </div>
  );
}
