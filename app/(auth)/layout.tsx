const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center mt-10 pb-20">
      {children}
    </div>
  );
};

export default AuthLayout;
