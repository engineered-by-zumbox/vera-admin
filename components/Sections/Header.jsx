import { Search } from "lucide-react";

const Header = ({ title }) => {
  return (
    <header className="sticky mb-8 top-0 bg-white z-[100] py-7 pt-4">
      <h1 className="text-[#696969]">{title}</h1>
    </header>
  );
};

export default Header;
