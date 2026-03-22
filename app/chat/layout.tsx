import { Providers } from "../providers";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <Providers>{children}</Providers>;
};

export default PageLayout;
