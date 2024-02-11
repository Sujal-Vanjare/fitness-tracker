import Footer from "@/components/footer/footer";

export default function Layout({ children }) {
  return (
    <div className="footerContainer">
      {children}
      <Footer />
    </div>
  );
}
