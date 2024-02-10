import Footer from "@/components/footer/footer";

export default function Layout({
  children, // will be a page or nested layout
}) {
  return (
    <div className="footerContainer">
      {children}
      <Footer />
    </div>
  );
}
