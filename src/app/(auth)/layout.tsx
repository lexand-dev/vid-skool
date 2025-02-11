interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
