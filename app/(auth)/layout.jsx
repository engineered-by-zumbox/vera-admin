const AuthLayout = ({ children }) => {
  return (
    <main className="h-dvh myFlex">
      <div className="basis-[45%]">{children}</div>
      <div className="basis-[55%] h-full">
        <img
          src="/images/auth.jpg"
          alt="building"
          className="w-full h-full object-cover"
        />
      </div>
    </main>
  );
};

export default AuthLayout;
