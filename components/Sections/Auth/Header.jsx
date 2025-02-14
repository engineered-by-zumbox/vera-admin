const Header = ({ title, desc }) => {
  return (
    <div>
      <img src="/images/v-logo.png" alt="veralyssa logo" />
      <h3 className="text-2xl font-bold mt-7">{title}</h3>
      <p className="text-myGray mt-2">{desc}</p>
    </div>
  );
};

export default Header;
